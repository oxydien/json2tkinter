# json2tkinter (lib)

A library that enables you to create Tkinter UIs without directly interacting with Tkinter itself. It's a lifesaver for rapid development! Originally intended as a workaround for Tkinter's complexities, this library has evolved into a surprisingly usable tool. While it may not be suitable for production environments, it's perfect for quick UI prototyping.

## Requirements
- **Python**: "Absolutely amazing" and "simple" to use.
- **Tkinter**: Garbage, but we make do.

## Features
- Parse a specific JSON structure to generate Tkinter UIs.
- Interact with created widgets from Python.
- Callbacks for buttons.
- Support for popups.

## Limitations
- No styling support.
- Only supports a limited set of widgets defined in the JSON structure: _Label_, _Input_, _Button_, _CheckBox_, _RadioButton_, _SelectMenu_, and _Layout_.
- Horrible UI aesthetics (inherent limitations of Tkinter).
- No event support (thanks to Tkinter).
- Terrible accessibility (another Tkinter drawback).
- Deficient error handling (due to Tkinter constraints).
- Performance issues (a common challenge with Tkinter).
- No support for window customization options, such as transparency and fullscreen (where do you think the issue is?).

## Future Possible Improvements (not planning to update)
- Support for additional widgets (e.g., Canvas, Listbox).
- Basic styling options.
- Multi-Window support.

### UI Builder

Want to use this library without crafting your own JSON from scratch?

- **[UI Builder](./builder/)**: A handy react web-app for generating JSON to use with this library.
- **[builder.html](./builder.html)**: Use a prebuilt HTML file for convenience.

### Usage

```python
import json2tkinter as j2t

with open('test.json') as file:
    json_data = file.read()

app = j2t.json2tkinter(json_data)

app.run()
```

For more _'advanced'_ usage, check out the [examples](./examples/).

### Installation

Simply download the `json2tkinter.py` file into your project folder, and you’re all set!
