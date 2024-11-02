import json2tkinter as j2t

# {
with open('test.json') as f:
    json = f.read()

is_switched = False
calculation_str = "";
calculation_str_2 = "";

app = j2t.json2tkinter(json)
# }

def nums(num: float) -> None:
    global calculation_str
    global calculation_str_2
    global is_switched

    print(f"Adding {num} to calculation")
    if is_switched:
        calculation_str_2 += str(num)
        app.set_value("output", calculation_str_2)
    else:
        calculation_str += str(num)
        app.set_value("output", calculation_str)

def clear() -> None:
    print("Clearing calculation")
    global calculation_str
    global calculation_str_2
    global is_switched

    calculation_str = ""
    calculation_str_2 = ""
    is_switched = False
    app.set_value("output", calculation_str)

def calculate() -> None:
    global calculation_str
    global calculation_str_2
    global is_switched

    if calculation_str == "" or calculation_str_2 == "":
        app.popup("Error", "Please enter both numbers to calculate (using switch button)")
        return

    operation = app.get_value("operation")
    print(f"Calculating {calculation_str} {operation} {app.get_value('output')}")
    if operation == "Add":
        app.set_value("output", float(calculation_str) + float(calculation_str_2))
    elif operation == "Subtract":
        app.set_value("output", float(calculation_str) - float(calculation_str_2))
    elif operation == "Multiply":
        app.set_value("output", float(calculation_str) * float(calculation_str_2))
    elif operation == "Divide":
        app.set_value("output", float(calculation_str) / float(calculation_str_2))
    else:
        app.set_value("output", "Invalid operation selected")
    calculation_str = app.get_value("output")
    calculation_str_2 = ""
    is_switched = False

def switch() -> None:
    global calculation_str
    global calculation_str_2
    global is_switched

    is_switched = not is_switched
    if is_switched:
        app.set_value("output", calculation_str_2)
    else:
        app.set_value("output", calculation_str)


# Register callback functions
app.widget_manager.register_callback('nums', nums)
app.widget_manager.register_callback('clear', clear)
app.widget_manager.register_callback('calculate', calculate)
app.widget_manager.register_callback('switch', switch)

app.run()
