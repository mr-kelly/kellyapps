"use client";
import type {
	Delivery,
	Frequency,
	SourceType,
} from "@fincy/domains/types/task";
import {
	Button,
	Chip,
	DialogContent,
	DialogTitle,
	FormControl,
	FormLabel,
	Input,
	Modal,
	ModalDialog,
	Option,
	Select,
	Stack,
} from "@mui/joy";
import * as React from "react";

interface NewTaskInput {
	title: string;
	sourceType: SourceType;
	sourceInput: string;
	frequency: Frequency;
	delivery: Delivery[];
	language: "en" | "zh_HK";
}
interface Props {
	open: boolean;
	onClose: () => void;
	create: (data: NewTaskInput) => void;
}

export function NewTaskDialog({ open, onClose, create }: Props) {
	const [sourceType, setSourceType] = React.useState<SourceType>("url");
	const [sourceInput, setSourceInput] = React.useState("");
	const [frequency, setFrequency] = React.useState<Frequency>("daily");
	const [delivery, setDelivery] = React.useState<Delivery[]>(["in-app"]);
	const [language, setLanguage] = React.useState<"en" | "zh_HK">("en");

	const canCreate = sourceInput.trim().length > 0;

	function toggleDelivery(v: Delivery) {
		setDelivery((d) => (d.includes(v) ? d.filter((x) => x !== v) : [...d, v]));
	}

	function submit() {
		if (!canCreate) return;
		const title = `${sourceInput} — ${frequency === "daily" ? "Daily" : frequency === "weekly" ? "Weekly" : "Realtime"}`;
		create({ title, sourceType, sourceInput, frequency, delivery, language });
		onClose();
	}

	return (
		<Modal open={open} onClose={onClose}>
			<ModalDialog sx={{ width: 480, maxWidth: "100%" }}>
				<DialogTitle>New Task</DialogTitle>
				<DialogContent>
					<form
						onSubmit={(e) => {
							e.preventDefault();
							submit();
						}}
					>
						<Stack spacing={2}>
							<Stack direction="row" spacing={2}>
								<FormControl size="sm" sx={{ flex: 1 }}>
									<FormLabel>Source Type</FormLabel>
									<Select
										value={sourceType}
										onChange={(_, v) => v && setSourceType(v as SourceType)}
									>
										<Option value="url">URL</Option>
										<Option value="keyword">Keyword</Option>
										<Option value="ticker">Ticker</Option>
									</Select>
								</FormControl>
								<FormControl size="sm" sx={{ flex: 1 }}>
									<FormLabel>Frequency</FormLabel>
									<Select
										value={frequency}
										onChange={(_, v) => v && setFrequency(v as Frequency)}
									>
										<Option value="daily">Daily</Option>
										<Option value="weekly">Weekly</Option>
										<Option value="realtime" disabled>
											Realtime (beta)
										</Option>
									</Select>
								</FormControl>
							</Stack>
							<FormControl size="sm">
								<FormLabel>Source Input</FormLabel>
								<Input
									value={sourceInput}
									onChange={(e) => setSourceInput(e.target.value)}
									placeholder="Paste URL, keyword, or ticker"
								/>
							</FormControl>
							<FormControl size="sm">
								<FormLabel>Delivery</FormLabel>
								<Stack direction="row" spacing={1} flexWrap="wrap">
									{(["in-app", "email", "im"] as Delivery[]).map((d) => (
										<Chip
											key={d}
											variant={delivery.includes(d) ? "solid" : "soft"}
											color={delivery.includes(d) ? "primary" : "neutral"}
											onClick={() => toggleDelivery(d)}
											size="sm"
										>
											{d === "im" ? "WhatsApp/WeChat" : d}
										</Chip>
									))}
								</Stack>
							</FormControl>
							<FormControl size="sm">
								<FormLabel>Language</FormLabel>
								<Select
									value={language}
									onChange={(_, v) => v && setLanguage(v as "en" | "zh_HK")}
								>
									<Option value="en">English</Option>
									<Option value="zh_HK">繁中</Option>
								</Select>
							</FormControl>
							<Stack
								direction="row"
								spacing={1}
								justifyContent="flex-end"
								pt={1}
							>
								<Button
									type="button"
									variant="plain"
									onClick={onClose}
									size="sm"
								>
									Cancel
								</Button>
								<Button
									type="submit"
									disabled={!canCreate}
									size="sm"
									variant="solid"
									color="primary"
								>
									Create Task
								</Button>
							</Stack>
						</Stack>
					</form>
				</DialogContent>
			</ModalDialog>
		</Modal>
	);
}
