"use client";
import { Button, Sheet } from "@mui/joy";

interface Props {
	onNew: () => void;
	onRunAll: () => void;
	onExport: () => void;
	running?: boolean;
}

export function QuickActionsBar({ onNew, onRunAll, onExport, running }: Props) {
	return (
		<Sheet
			variant="soft"
			sx={{
				backdropFilter: "blur(8px)",
				p: 2,
				display: "flex",
				flexDirection: { xs: "row", md: "column" },
				gap: { xs: 1.5, md: 2 },
				borderRadius: { md: "lg" },
				width: { md: 208 },
				border: "1px solid",
				borderColor: "neutral.outlinedBorder",
			}}
		>
			<Button
				onClick={onNew}
				size="sm"
				color="primary"
				variant="solid"
				sx={{ flex: 1 }}
			>
				+ New Task
			</Button>
			<Button
				onClick={onRunAll}
				size="sm"
				disabled={running}
				variant="soft"
				sx={{ flex: 1 }}
			>
				Run All Now
			</Button>
			<Button onClick={onExport} size="sm" variant="soft" sx={{ flex: 1 }}>
				Export Today
			</Button>
		</Sheet>
	);
}

export default QuickActionsBar;
