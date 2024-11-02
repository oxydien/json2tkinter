import { Plus, Trash2 } from "lucide-react";
import { useState, useRef, type MutableRefObject } from "react";
import { selectedWidget, updateWidget, removeWidget } from "../handler";
import type EmptyWidget from "../interfaces/emptyWidget";

export const WidgetProperties = () => {
	const [focusedField, setFocusedField] = useState<string | null>(null);
	const inputRefs: MutableRefObject<{ [key: string]: HTMLInputElement }> =
		useRef({});

	if (!selectedWidget) return null;

	const updateWidgetWithFocus = (updates: EmptyWidget) => {
		console.log(
			"Updating focused",
			updates,
			"target:",
			selectedWidget,
			"input:",
			focusedField,
			inputRefs.current[focusedField || ""],
		);
		updateWidget(updates);
		if (focusedField && inputRefs.current[focusedField]) {
			inputRefs.current[focusedField].focus();
		}
	};
	return (
		<div className="p-4 bg-gray-800 rounded-lg">
			{" "}
			<h3 className="text-lg font-semibold mb-4 text-white">
				Widget Properties
			</h3>{" "}
			<div className="space-y-4">
				{" "}
				{selectedWidget.type !== "Layout" &&
					selectedWidget.type !== "Input" && (
						<div>
							{" "}
							<label
								className="block text-sm font-medium mb-1 text-white"
								htmlFor="configText"
							>
								Text
							</label>{" "}
							<input
								ref={(el) => {
									if (el) {
										inputRefs.current.text = el;
									}
								}}
								type="text"
								value={selectedWidget.text || ""}
								onChange={(e) =>
									updateWidgetWithFocus({ text: e.target.value })
								}
								onKeyDown={(e) => {
									if (e.key === "Enter") {
										updateWidgetWithFocus({
											text: (e.target as HTMLInputElement).value,
										});
									}
								}}
								onFocus={() => setFocusedField("text")}
								onBlur={() => setFocusedField(null)}
								className="w-full p-2 bg-gray-700 border border-gray-600 rounded text-white"
							/>{" "}
						</div>
					)}{" "}
				{(selectedWidget.type === "Input" ||
					selectedWidget.type === "CheckBox" ||
					selectedWidget.type === "RadioButton" ||
					selectedWidget.type === "SelectMenu") && (
					<div>
						{" "}
						<label
							className="block text-sm font-medium text-white mb-1"
							htmlFor="configId"
						>
							ID
						</label>{" "}
						<input
							ref={(el) => {
								if (el) {
									inputRefs.current.id = el;
								}
							}}
							type="text"
							value={selectedWidget.id || ""}
							onChange={(e) => updateWidgetWithFocus({ id: e.target.value })}
							onFocus={() => setFocusedField("id")}
							onBlur={() => setFocusedField(null)}
							className="w-full p-2 bg-gray-700 border border-gray-600 rounded text-white"
						/>{" "}
					</div>
				)}{" "}
				{selectedWidget.type === "Button" && (
					<div>
						{" "}
						<label
							className="block text-sm font-medium text-white mb-1"
							htmlFor="configExecute"
						>
							Execute Function <span className="text-gray-500 fss">(name)</span>
						</label>{" "}
						<input
							ref={(el) => {
								if (el) {
									inputRefs.current.execute = el;
								}
							}}
							type="text"
							value={selectedWidget.execute || ""}
							onChange={(e) =>
								updateWidgetWithFocus({ execute: e.target.value })
							}
							onFocus={() => setFocusedField("execute")}
							onBlur={() => setFocusedField(null)}
							className="w-full p-2 bg-gray-700 border border-gray-600 rounded text-white"
						/>
					</div>
				)}{" "}
				{selectedWidget.type === "Layout" && (
					<div>
						{" "}
						<label
							className="block text-sm font-medium text-white mb-1"
							htmlFor="configKind"
						>
							Layout Kind
						</label>{" "}
						<select
							id="configKind"
							value={selectedWidget.kind}
							onChange={(e) => updateWidget({ kind: e.target.value })}
							className="w-full p-2 border rounded"
						>
							{" "}
							<option value="vertical">Vertical</option>{" "}
							<option value="horizontal">Horizontal</option>{" "}
						</select>{" "}
					</div>
				)}{" "}
				{selectedWidget.type === "SelectMenu" && (
					<div>
						{" "}
						<label
							className="block text-sm font-medium text-white mb-1"
							htmlFor="configOptions"
						>
							Options
						</label>{" "}
						<div className="space-y-2">
							{" "}
							{(selectedWidget?.options || []).map((option, idx) => (
								// biome-ignore lint/suspicious/noArrayIndexKey: Works as intended
								<div key={`${option}-${idx}`} className="flex gap-2">
									{" "}
									<input
										ref={(el) => {
											if (el) {
												inputRefs.current[`option_${idx}`] = el;
											}
										}}
										type="text"
										value={option}
										onChange={(e) => {
											const newOptions = [...(selectedWidget?.options || [])];
											newOptions[idx] = e.target.value;
											updateWidgetWithFocus({ options: newOptions });
										}}
										onFocus={() => setFocusedField(`option_${idx}`)}
										onBlur={() => setFocusedField(null)}
										className="flex-1 p-2 bg-gray-700 border border-gray-600 rounded text-white"
									/>{" "}
									<button
										type="button"
										onClick={() => {
											const newOptions = (selectedWidget?.options || []).filter(
												(_, i) => i !== idx,
											);
											updateWidget({ options: newOptions });
										}}
										className="p-2 text-red-600 hover:bg-rose-950 outline outline-1 outline-red-600 rounded"
									>
										{" "}
										<Trash2 size={16} />{" "}
									</button>{" "}
								</div>
							))}{" "}
							<button
								type="button"
								onClick={() =>
									updateWidget({
										options: [
											...(selectedWidget?.options || []),
											`Option ${(selectedWidget?.options || []).length + 1}`,
										],
									})
								}
								className="w-full p-2 bg-blue-800 hover:bg-indigo-950 text-white rounded flex items-center justify-center gap-2"
							>
								{" "}
								<Plus size={16} /> Add Option{" "}
							</button>{" "}
						</div>{" "}
					</div>
				)}{" "}
				{selectedWidget && (
					<button
						type="button"
						onClick={() => selectedWidget && removeWidget(selectedWidget)}
						className="w-full p-2 bg-red-800 hover:bg-rose-950 text-red-200 rounded flex items-center justify-center gap-2 outline outline-1 outline-red-400"
					>
						{" "}
						<Trash2 size={16} /> Remove{" "}
					</button>
				)}{" "}
			</div>{" "}
		</div>
	);
};
