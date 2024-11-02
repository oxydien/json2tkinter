import type App from "../interfaces/app";
import type Widget from "../interfaces/widget";

const AppPreview = ({ app }: { app: App }) => {
	if (!app) return null;

	// Parse geometry string (e.g., "600x300")
	const [width, height] = app.geometry
		.split("x")
		.map((num) => Number.parseInt(num));

	// Render a widget based on its type
	const renderWidget = (widget: Widget) => {
		switch (widget.type) {
			case "Layout":
				return (
					<div
						key={widget.index}
						className={`app-widget-layout flex ${
							widget.kind === "horizontal" ? "flex-row" : "flex-col"
						} gap-2 flex-1 border border-dashed border-gray-300`}
					>
						{widget.content?.map((child) => renderWidget(child))}
					</div>
				);

			case "Button":
				return (
					<button type="button" key={widget.index}>
						{widget.text || "Button"}
					</button>
				);

			case "Input":
				return (
					<input
						key={widget.index}
						type="text"
						placeholder={widget.id || "Input"}
						readOnly
					/>
				);

			case "RadioButton":
				return (
					<label key={widget.index}>
						<input type="radio" name={widget.id || "radio"} />
						<span>{widget.text || "Radio Button"}</span>
					</label>
				);

			case "Label":
				return (
					<p key={widget.index}>
						<span>{widget.text || "Label"}</span>
					</p>
				);

			case "CheckBox":
				return (
					<label key={widget.index}>
						<input type="checkbox" name={widget.id || "checkbox"} />
						<span>{widget.text || "Checkbox"}</span>
					</label>
				);

			case "SelectMenu":
				return (
					<select key={widget.index}>
						{widget.options?.map((option, i) => (
							// biome-ignore lint/suspicious/noArrayIndexKey: Don't care about optimizing this
							<option key={i}>{option}</option>
						)) || <option>Select...</option>}
					</select>
				);

			default:
				return <div key={widget.index}>Unknown widget: {widget.type}</div>;
		}
	};

	return (
		<div className="app-preview w-full flex flex-col items-center gap-4">
			<div className="text-sm text-gray-500">
				Window size: {width}x{height}
			</div>
			<div
				className="app-preview-root border border-gray-400 rounded-lg shadow-md bg-white"
				style={{
					width: `${width}px`,
					height: `${height + 35}px`,
					maxWidth: "100%",
					maxHeight: "80vh",
					overflow: "auto",
				}}
			>
				<div className="app-preview-title text-center">{app.title}</div>
				<div className="app-preview-content p-2">
					{app.content?.map((widget) => renderWidget(widget))}
				</div>
			</div>
		</div>
	);
};

export default AppPreview;
