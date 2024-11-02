"""
Library for converting JSON structure to Tkinter interface
License: MIT
Author: [oxydien](https://github.com/oxydien) (2024)
"""
# helicopter was here 🚁
"""
Not properly tested, use at your own risk (tkinter is also not ready for production, soo...).
Made primarily for personal use and as a joke.

Usage:
```python
with open('test.json') as f:
    json = f.read()

app = json2tkinter(json)

app.run()
```

test.json:
```json
{
    "title":"My Tkinter App",
    "geometry":"300x250",
    "version":"0.1.0",
    "content":[
        {
            "type":"Label",
            "text":"Hello World"
        }
    ]
}
```
"""

import tkinter as tk
from tkinter import ttk
import json
from typing import Any, Dict, List, Optional, Union
from tkinter.messagebox import showerror, showwarning, showinfo

class TkinterWidgetManager:
    """Manages Tkinter widgets and their values/states"""
    def __init__(self):
        self.widgets = {}
        self.callbacks = {}

    def register_widget(self, widget_id: str, widget: Union[tk.Widget, ttk.Widget]) -> None:
        """Register a widget for later value/state retrieval"""
        self.widgets[widget_id] = widget

    def register_callback(self, callback_name: str, callback_func) -> None:
        """Register a callback function"""
        self.callbacks[callback_name] = callback_func

    def get_value(self, widget_id: str) -> Any:
        """Get the value/state of a registered widget"""
        widget = self.widgets.get(widget_id)
        if not widget:
            raise ValueError(f"No widget found with id: {widget_id}")

        if isinstance(widget, (tk.Entry, ttk.Entry)):
            return widget.get()
        elif isinstance(widget, (tk.Checkbutton, ttk.Checkbutton)):
            return bool(widget.get())
        elif isinstance(widget, ttk.Combobox):
            return widget.get()
        else:
            raise ValueError(f"Unsupported widget type for value retrieval: {type(widget)}")
    
    def set_value(self, widget_id: str, value: Any) -> None:
        """Set the value/state of a registered widget"""
        widget = self.widgets.get(widget_id)
        if not widget:
            raise ValueError(f"No widget found with id: {widget_id}")

        if isinstance(widget, (tk.Entry, ttk.Entry)):
            widget.delete(0, tk.END)
            widget.insert(0, value)
        elif isinstance(widget, (tk.Checkbutton, ttk.Checkbutton)):
            widget.set(value)
        elif isinstance(widget, ttk.Combobox):
            widget.set(value)
        else:
            raise ValueError(f"Unsupported widget type for value setting: {type(widget)}")

class Json2Tkinter:
    """Main class for converting JSON to Tkinter interface"""
    def __init__(self, json_str: str):
        self.config = json.loads(json_str)
        self.root = tk.Tk()
        self.widget_manager = TkinterWidgetManager()
        
        # Configure root window
        if "title" in self.config:
            self.root.title(self.config["title"])
        if "geometry" in self.config:
            self.root.geometry(self.config["geometry"])
            
        # Create widgets from JSON
        self._create_widgets(self.config.get("content", []), self.root)

    def _create_widgets(self, content: List[Dict], parent: Union[tk.Widget, ttk.Widget]) -> None:
        """Recursively create widgets from JSON configuration. Supports Label (Label), Input (Entry), Button (Button), CheckBox (Checkbutton), RadioButton (Radiobutton), SelectMenu (Combobox), Layout (Frame)"""
        for widget_config in content:
            widget_type = widget_config.get("type")
            
            if widget_type == "Label":
                tk.Label(parent, text=widget_config.get("text", "")).pack(pady=5)
                
            elif widget_type == "Input":
                entry = ttk.Entry(parent)
                entry.pack(pady=5)
                if "id" in widget_config:
                    self.widget_manager.register_widget(widget_config["id"], entry)
                    
            elif widget_type == "Button":
                execute = widget_config.get("execute")
                if isinstance(execute, dict):
                    func_name = execute.get("name", "")
                    args = execute.get("args", [])
                else:
                    func_name = execute
                    args = []
                
                button = ttk.Button(
                    parent,
                    text=widget_config.get("text", ""),
                    command=lambda: self._call_function(func_name, args) if func_name in self.widget_manager.callbacks else None
                )
                button.pack(pady=5)
                
            elif widget_type == "CheckBox":
                var = tk.BooleanVar()
                checkbox = ttk.Checkbutton(
                    parent,
                    text=widget_config.get("text", ""),
                    variable=var
                )
                checkbox.pack(pady=5)
                if "id" in widget_config:
                    self.widget_manager.register_widget(widget_config["id"], var)
                    
            elif widget_type == "RadioButton":
                if not hasattr(self, "_radio_vars"):
                    # Due to the way how RadioButtons work, we need to keep track of them in a separate dictionary. NICE! :)
                    self._radio_vars = {}
                    
                group_id = widget_config.get("id")
                if group_id not in self._radio_vars:
                    self._radio_vars[group_id] = tk.StringVar()
                    
                radio = ttk.Radiobutton(
                    parent,
                    text=widget_config.get("text", ""),
                    variable=self._radio_vars[group_id],
                    value=widget_config.get("text", "")
                )
                radio.pack(pady=5)
                
            elif widget_type == "SelectMenu":
                combobox = ttk.Combobox(
                    parent,
                    values=widget_config.get("options", []),
                    state="readonly"
                )
                combobox.pack(pady=5)
                if "id" in widget_config:
                    self.widget_manager.register_widget(widget_config["id"], combobox)
                    
            elif widget_type == "Layout":
                frame = ttk.Frame(parent)
                frame.pack(pady=5, fill=tk.BOTH, expand=True)
                
                if widget_config.get("kind") == "horizontal":
                    # Workaround for horizontal layout, by creating a new frame for each child widget
                    for item in widget_config.get("content", []):
                        inner_frame = ttk.Frame(frame)
                        inner_frame.pack(side=tk.LEFT, padx=5)
                        self._create_widgets([item], inner_frame)
                else:  # vertical layout
                    self._create_widgets(widget_config.get("content", []), frame)

    def _call_function(self, func_name: str, args: list) -> Any:
        """Call a function (callback) by name that has been registered in the widget manager"""
        if func_name in self.widget_manager.callbacks:
            callback = self.widget_manager.callbacks[func_name]
            if callable(callback):
                return callback(*args)
        return None

    def run(self) -> None:
        """Start the Tkinter main loop"""
        self.root.mainloop()

    def get_value(self, widget_id: str) -> Any:
        """Get the value of a widget by its ID"""
        if widget_id in self._radio_vars:
            return self._radio_vars[widget_id].get()
        return self.widget_manager.get_value(widget_id)

    def set_value(self, widget_id: str, value: Any) -> None:
        """Set the value of a widget by its ID"""
        if widget_id in self._radio_vars:
            self._radio_vars[widget_id].set(value)
        self.widget_manager.set_value(widget_id, value)
    
    def popup(self, title: str, message: str, type: str = "error") -> None:
        """Create an error, warning or info popup"""
        if type == "error":
            showerror(title, message)
        elif type == "warning":
            showwarning(title, message)
        elif type == "info":
            showinfo(title, message)
        else:
            raise ValueError("Invalid popup type. Must be 'error', 'warning' or 'info'.")

def json2tkinter(json_str: str) -> Json2Tkinter:
    """Factory function to create Json2Tkinter instance"""
    return Json2Tkinter(json_str)
