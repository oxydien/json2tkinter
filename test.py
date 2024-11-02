import json2tkinter as j2t

with open('test.json') as file:
    json = file.read()

app = j2t.json2tkinter(json)

def hello_world():
    app.popup("Hello World", "Hello World", "info")
    print('hello world')

app.widget_manager.register_callback('hello_world', hello_world)

app.run()



