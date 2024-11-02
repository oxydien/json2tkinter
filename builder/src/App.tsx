import { useState } from "react";
import { WidgetPreview } from "./components/WidgetPreview";
import { WidgetProperties } from "./components/WidgetProperties";
import {
	addWidget,
	getMaximumWidgetIndex,
	setAppCallbacks,
	setSelectedWidgetCallback,
	setWidgetCounter,
	widgetCounter,
} from "./handler";
import type App from "./interfaces/app";
import type Widget from "./interfaces/widget";
import AppPreview from "./components/AppPreview";
import { Copy, Upload } from "lucide-react";

export const widgetTypes = [
	{ type: "Label", defaults: { type: "Label" } },
	{ type: "Input", defaults: { type: "Input", id: "input_1" } },
	{
		type: "Button",
		defaults: { type: "Button", text: "New Button", execute: "button_func" },
	},
	{
		type: "CheckBox",
		defaults: { type: "CheckBox", text: "New Checkbox", id: "checkbox_1" },
	},
	{
		type: "RadioButton",
		defaults: { type: "RadioButton", text: "New Radio", id: "radio_group_1" },
	},
	{
		type: "SelectMenu",
		defaults: {
			type: "SelectMenu",
			id: "select_1",
			text: "Select Menu",
			options: ["Option 1"],
		},
	},
	{
		type: "Layout",
		defaults: { type: "Layout", kind: "vertical", content: [] },
	},
];

const TkinterBuilder = () => {
	const [app, setApp] = useState<App>({
		title: "My Tkinter App",
		geometry: "300x250",
		version: "0.1.0",
		content: [],
	} as App);
	const [selectedWidget, setSelectedWidget] = useState<Widget | null>(null);

	// @ts-ignore
	setAppCallbacks(app, setApp);
	setSelectedWidgetCallback(selectedWidget, setSelectedWidget);

	return (
		<div className="min-h-screen bg-gray-900 p-6">
			{" "}
			<div className="mx-auto">
				{" "}
				<div className="mb-6">
					{" "}
					<h1 className="text-2xl font-bold mb-4 text-white">
						Tkinter App Builder
					</h1>{" "}
					<div className="grid grid-cols-2 gap-4 max-w-5xl">
						{" "}
						<div>
							{" "}
							<label
								className="block text-sm font-medium text-white mb-1"
								htmlFor="configTitle"
							>
								App Title
							</label>{" "}
							<input
								id="configTitle"
								type="text"
								value={app.title}
								onChange={(e) =>
									setApp((prev) => ({ ...prev, title: e.target.value }))
								}
								className="w-full p-2 border rounded bg-gray-800 text-white"
							/>{" "}
						</div>{" "}
						<div>
							{" "}
							<label
								className="block text-sm text-white font-medium mb-1"
								htmlFor="configGeometry"
							>
								Window Geometry
							</label>{" "}
							<input
								id="configGeometry"
								type="text"
								value={app.geometry}
								onChange={(e) =>
									setApp((prev) => ({ ...prev, geometry: e.target.value }))
								}
								className="w-full p-2 border rounded bg-gray-800 text-white"
							/>{" "}
						</div>{" "}
					</div>{" "}
				</div>{" "}
				<div className="grid grid-cols-2 gap-6 max-w-5xl">
					{" "}
					<div className="col-span-1">
						{" "}
						<div className="bg-gray-800 p-4 rounded-lg shadow">
							{" "}
							<div className="flex items-center justify-between mb-4">
								<h2 className="text-lg font-semibold text-white">
									Widget Tree{" "}
									<abbr
										className="text-sm text-gray-400"
										title="Widget Counter, counts how many widgets were created.&#013;It does not count amount of current widgets."
									>
										({widgetCounter})
									</abbr>
								</h2>{" "}
								<select
									id="configKind"
									onClick={(e) => e.stopPropagation()}
									onKeyDown={(e) => e.key === "Enter" && e.stopPropagation()}
									onChange={(e) => {
										e.stopPropagation();
										const selectedType = widgetTypes.find(
											(w) => w.type === e.target.value,
										);
										if (selectedType) {
											addWidget(selectedType);
										}
										e.target.value = "";
									}}
									className="text-sm border rounded p-1 bg-gray-900 text-white"
								>
									<option value="">Add child...</option>
									{widgetTypes.map((type, idx) => (
										<option key={`${type.type}-${idx}`} value={type.type}>
											{type.type}
										</option>
									))}
								</select>
							</div>
							<div className="space-y-2">
								{" "}
								{app.content.map((widget, idx) => (
									<div key={widget.id || idx} className="relative group">
										{" "}
										<WidgetPreview
											index={idx}
											widget={widget}
											onSelect={setSelectedWidget}
											isSelected={widget === selectedWidget}
										/>{" "}
									</div>
								))}{" "}
							</div>{" "}
						</div>{" "}
					</div>{" "}
					<div className="col-span-1">
						<div className="bg-gray-800 rounded-lg shadow">
							{selectedWidget ? (
								<WidgetProperties />
							) : (
								<div className="p-4 justify-between mb-4">
									<h2 className="text-lg font-semibold mb-4 text-white">
										Widget Properties
									</h2>
									<p className="text-white text-center">
										No widget selected
										<br />
										<em className="text-gray-400">
											Select a widget to view its properties
										</em>
									</p>
								</div>
							)}
						</div>
					</div>
				</div>{" "}
				<div className="mt-6 flex w-full gap-6">
					{" "}
					<div className="json-preview-wrapper w-full max-w-[550px]">
						<h2 className="text-lg font-semibold mb-2 text-white">
							Generated JSON
						</h2>{" "}
						<div className="buttons flex gap-2">
							<button
								type="button"
								className="flex items-center text-white text-sm pointer mb-2 p-2 bg-gray-600 rounded"
								onClick={(e) => {
									navigator.clipboard.writeText(JSON.stringify(app));
									e.stopPropagation();
									(e.target as HTMLButtonElement).innerText = "Copied!";
									setTimeout(() => {
										(e.target as HTMLButtonElement).innerText = "Copy JSON";
									}, 2000);
								}}
							>
								<Copy size={16} />
								<span className="ml-2">Copy JSON</span>
							</button>
							<button
								type="button"
								className="flex items-center text-white text-sm pointer mb-2 p-2 bg-gray-600 rounded"
								onClick={(e) => {
									navigator.clipboard.readText().then((text) => {
										const json = JSON.parse(text);
										setApp(json);
										setWidgetCounter(getMaximumWidgetIndex(json.content) || 0);
										e.stopPropagation();
									});
								}}
							>
								<Upload size={16} />
								<span className="ml-2">From clipboard</span>
							</button>
						</div>
						<pre className="bg-gray-800 text-gray-100 p-4 rounded-lg overflow-auto">
							{" "}
							{JSON.stringify(app, null, 2)}{" "}
						</pre>{" "}
					</div>
					<div className="preview-wrapper">
						<h2 className="text-lg font-semibold mb-2 text-white">Preview</h2>{" "}
						<AppPreview app={app} />
					</div>
				</div>{" "}
			</div>{" "}
		</div>
	);
};
export default TkinterBuilder;
