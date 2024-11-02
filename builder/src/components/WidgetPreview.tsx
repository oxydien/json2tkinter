import { ArrowUp, ArrowDown } from "lucide-react";
import { widgetTypes } from "../App";
import { addChildToLayout, moveWidget, selectedWidget } from "../handler";
import type Widget from "../interfaces/widget";

type WidgetPreviewProps = {
	widget: Widget;
	onSelect: (widget: Widget) => void;
	isSelected: boolean;
	parentPath?: number[];
	index: number;
};

export const WidgetPreview = ({
	widget,
	onSelect,
	isSelected,
	parentPath = [],
	index,
}: WidgetPreviewProps) => {
	const borderClass = isSelected ? "border-blue-500" : "border-gray-200";

	return (
		// biome-ignore lint/a11y/useKeyWithClickEvents: Not made for keyboard use
		<div
			className={`p-2 border-2 ${borderClass} rounded-lg mb-2 cursor-pointer hover:bg-gray-800 bg-gray-900 text-white`}
			onClick={(e) => {
				e.stopPropagation();
				if (e.target === e.currentTarget) onSelect(widget);
			}}
		>
			<div className="flex items-center gap-2 text-sm">
				<div className="flex items-center gap-1">
					<button
						type="button"
						onClick={(e) => {
							e.stopPropagation();
							moveWidget(widget, "up");
						}}
						className="p-1 hover:bg-gray-700 rounded"
					>
						<ArrowUp size={16} />
					</button>
					<button
						type="button"
						onClick={(e) => {
							e.stopPropagation();
							moveWidget(widget, "down");
						}}
						className="p-1 hover:bg-gray-700 rounded"
					>
						<ArrowDown size={16} />
					</button>
				</div>
				<div
					className="flex-1"
					onClick={() => onSelect(widget)}
					onKeyDown={(e) => e.key === "Enter" && onSelect(widget)}
				>
					<span className="font-medium">{widget.type}</span>
					{widget.text && (
						<span className="text-gray-400">- {widget.text}</span>
					)}
					{widget.kind && (
						<span className="text-gray-400">- {widget.kind}</span>
					)}
				</div>
				{widget.type === "Layout" && (
					<div className="flex items-center gap-1">
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
									addChildToLayout(widget, selectedType);
								}
								e.target.value = "";
							}}
							className="text-sm border border-gray-700 bg-gray-800 text-white rounded p-1"
						>
							<option value="">Add child...</option>
							{widgetTypes.map((type, idx) => (
								<option key={`${type.type}-${idx}`} value={type.type}>
									{type.type}
								</option>
							))}
						</select>
					</div>
				)}
			</div>

			{widget.content && widget.content.length > 0 && (
				<div className="mt-2 border-gray-800">
					{widget.content.map((childWidget: Widget, idx: number) => (
						<WidgetPreview
							key={`${childWidget.type}-${idx}`}
							widget={childWidget}
							onSelect={onSelect}
							isSelected={childWidget === selectedWidget}
							parentPath={[...parentPath, index]}
							index={idx}
						/>
					))}
				</div>
			)}
		</div>
	);
};
