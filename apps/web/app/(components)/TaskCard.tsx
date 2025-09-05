"use client";
import {
	Button,
	Card,
	CardContent,
	Chip,
	Dropdown,
	IconButton,
	Menu,
	MenuButton,
	MenuItem,
	Stack,
	Typography,
} from "@mui/joy";
import type { Task } from "../../lib/tasks";

interface Props {
	task: Task;
	onOpen: () => void;
	onShare: () => void;
	onDelete: () => void;
	onDuplicate: () => void;
	onEdit: () => void;
}

const statusColor: Record<string, "success" | "neutral" | "danger"> = {
	"done-today": "success",
	scheduled: "neutral",
	error: "danger",
};

export function TaskCard({
	task,
	onOpen,
	onShare,
	onDelete,
	onDuplicate,
	onEdit,
}: Props) {
	return (
		<Card variant="soft" sx={{ borderRadius: "xl", position: "relative" }}>
			<CardContent
				sx={{ display: "flex", flexDirection: "column", gap: 1.5, p: 2 }}
			>
				<Stack
					direction="row"
					justifyContent="space-between"
					alignItems="flex-start"
					spacing={1.5}
				>
					<div style={{ flex: 1, minWidth: 0 }}>
						<Typography level="title-sm" noWrap>
							{task.title}
						</Typography>
						<Stack
							direction="row"
							spacing={0.5}
							flexWrap="wrap"
							mt={0.5}
							sx={{ "--Chip-gap": "4px" }}
						>
							<Chip
								size="sm"
								variant="soft"
								color="neutral"
								sx={{ fontSize: 10, textTransform: "uppercase" }}
							>
								{task.sourceType}:{task.sourceInput}
							</Chip>
							<Chip
								size="sm"
								variant="soft"
								color="neutral"
								sx={{ fontSize: 10 }}
							>
								{task.frequency}
							</Chip>
							{task.lastRunAt && (
								<Chip
									size="sm"
									variant="soft"
									color="neutral"
									sx={{ fontSize: 10 }}
									title={task.lastRunAt}
								>
									last{" "}
									{new Date(task.lastRunAt).toLocaleTimeString([], {
										hour: "2-digit",
										minute: "2-digit",
									})}
								</Chip>
							)}
						</Stack>
					</div>
					<Chip
						size="sm"
						variant="soft"
						color={statusColor[task.status]}
						sx={{ fontSize: 10 }}
					>
						{task.status === "done-today"
							? "Done today"
							: task.status === "scheduled"
								? "Scheduled"
								: "Error"}
					</Chip>
					<TaskMenu
						onEdit={onEdit}
						onDuplicate={onDuplicate}
						onDelete={onDelete}
					/>
				</Stack>
				<Stack direction="row" spacing={1}>
					<Button
						onClick={onOpen}
						size="sm"
						variant="solid"
						color="primary"
						sx={{ flex: 1 }}
					>
						Open Summary
					</Button>
					<Button
						onClick={onShare}
						size="sm"
						variant="soft"
						sx={{ minWidth: 80 }}
					>
						Share
					</Button>
				</Stack>
			</CardContent>
		</Card>
	);
}

function TaskMenu({
	onEdit,
	onDuplicate,
	onDelete,
}: { onEdit: () => void; onDuplicate: () => void; onDelete: () => void }) {
	return (
		<Dropdown>
			<MenuButton
				slots={{ root: IconButton }}
				slotProps={{ root: { size: "sm", variant: "plain", color: "neutral" } }}
			>
				⋮
			</MenuButton>
			<Menu size="sm" placement="bottom-end">
				<MenuItem onClick={onEdit}>Edit</MenuItem>
				<MenuItem onClick={onDuplicate}>Duplicate</MenuItem>
				<MenuItem color="danger" onClick={onDelete}>
					Delete
				</MenuItem>
			</Menu>
		</Dropdown>
	);
}

export default TaskCard;
