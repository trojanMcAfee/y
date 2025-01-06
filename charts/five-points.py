import json
import matplotlib.pyplot as plt

# Load the data from the uploaded JSON file
data = json.load(open('./kraken_ohlc.json'))

# Extract closing prices from the OHLC data
closing_prices = [float(entry[4]) for entry in data['result']['ZEURZUSD']]

# Parameters for the 5-point figure chart
point_increment = 0.001  # Define a "full point" for forex
reversal_threshold = 5 * point_increment  # 5 points for reversal
chart = []  # List to store the chart columns

# Initialize the chart with the first closing price
current_price = closing_prices[0]
current_column = [current_price]
current_direction = None  # "up" or "down"

for price in closing_prices[1:]:
    if current_direction is None:
        # Determine initial direction
        if price > current_price + point_increment:
            current_direction = "up"
            current_column.append(price)
        elif price < current_price - point_increment:
            current_direction = "down"
            current_column.append(price)
    elif current_direction == "up":
        if price >= current_column[-1] + point_increment:
            current_column.append(price)
        elif price <= current_column[-1] - reversal_threshold:
            # Reverse direction
            chart.append({"direction": "up", "values": current_column})
            current_direction = "down"
            current_column = [current_column[-1] - point_increment, price]
    elif current_direction == "down":
        if price <= current_column[-1] - point_increment:
            current_column.append(price)
        elif price >= current_column[-1] + reversal_threshold:
            # Reverse direction
            chart.append({"direction": "down", "values": current_column})
            current_direction = "up"
            current_column = [current_column[-1] + point_increment, price]

# Append the last column
if current_column:
    chart.append({"direction": current_direction, "values": current_column})

# Prepare data for plotting
x_vals = []  # X-axis (columns)
y_vals = []  # Y-axis (price levels)

for col_index, col in enumerate(chart):
    for price in col["values"]:
        x_vals.append(col_index)
        y_vals.append(price)

# Plot the data
plt.figure(figsize=(10, 6))
plt.plot(x_vals, y_vals, marker="o", linestyle="-")
plt.title("5-Point Figure Chart for EUR/USD")
plt.xlabel("Columns")
plt.ylabel("Price")
plt.grid()
plt.show()

# Output the chart in a readable format
print("5-Point Figure Chart:")
for i, column in enumerate(chart):
    direction = "Up" if column["direction"] == "up" else "Down"
    print(f"Column {i + 1} ({direction}):", " -> ".join(f"{x:.5f}" for x in column["values"]))
