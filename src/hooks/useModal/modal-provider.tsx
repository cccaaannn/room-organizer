import React, { createContext, useCallback, useMemo, useState } from "react";

import { createPortal } from "react-dom";

import ModalContainer from "@/hooks/useModal/modal-container";


interface ModalOptions {
	closeOnClickOutside?: boolean;
	modalClassName?: string;
}

interface ModalContextType {
	openModal: (component: React.ReactNode, options?: ModalOptions) => void;
	closeModal: () => void;
}

const DefaultModalOptions: Required<ModalOptions> = {
	closeOnClickOutside: true,
	modalClassName: ""
};

export const ModalContext = createContext<ModalContextType | undefined>(undefined);

interface Props {
	children: React.ReactNode;
	options?: ModalOptions;
}

const ModalProvider = (props: Props) => {
	const [modalContent, setModalContent] = useState<React.ReactNode | null>(null);
	const [modalOptions, setModalOptions] = useState<ModalOptions>({ ...DefaultModalOptions, ...props.options });

	const openModal = useCallback((content: React.ReactNode, _modalOptions?: ModalOptions) => {
		if (_modalOptions) {
			setModalOptions({
				...DefaultModalOptions,
				...props.options,
				..._modalOptions
			});
		}

		setModalContent(content);
	}, [props.options]);

	const closeModal = useCallback(() => {
		setModalContent(null);
		setModalOptions({ ...DefaultModalOptions, ...props.options });
	}, [props.options]);

	const memoizedContext = useMemo(() => ({
		openModal, closeModal
	}), [openModal, closeModal]);

	const memoizedModal = useMemo(() => {
		if (modalContent) {
			return createPortal(
				<ModalContainer
					onClose={closeModal}
					closeOnClickOutside={modalOptions.closeOnClickOutside}
					modalClassName={modalOptions.modalClassName}
				>
					{modalContent}
				</ModalContainer>,
				document.body
			);
		}

		return null;
	}, [closeModal, modalContent, modalOptions]);

	return (
		<ModalContext.Provider value={memoizedContext}>
			{props.children}


			{memoizedModal}
		</ModalContext.Provider>
	);
};

export default ModalProvider;