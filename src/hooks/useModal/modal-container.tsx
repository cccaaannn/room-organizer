import type React from "react";
import { useRef } from "react";

import { cn } from "@/components/shadcn/lib/utils";


interface Props {
	children: React.ReactNode;
	onClose: () => void;
	closeOnClickOutside?: boolean;
	modalClassName?: string;
}

const ModalContainer = (props: Props) => {
	const modalRef = useRef<HTMLDivElement>(null);

	const handleBackdropClick = (e: React.MouseEvent) => {
		if (props.closeOnClickOutside && e.target === modalRef.current) {
			props.onClose();
		}
	};

	return (
		<div className="fixed inset-0 z-50 bg-black/50" ref={modalRef} onClick={handleBackdropClick}>
			<div
				className={cn(
					"fixed top-[50%] left-[50%] z-50 grid w-full max-w-[calc(100%-2rem)] translate-x-[-50%] translate-y-[-50%] sm:max-w-lg",
					props.modalClassName
				)}
			>
				{props.children}
			</div>
		</div>
	);
};

export default ModalContainer;
