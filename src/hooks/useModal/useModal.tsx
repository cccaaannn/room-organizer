import { useContext } from "react";

import { ModalContext } from "@/hooks/useModal/modal-provider";


const useModal = () => {
	const context = useContext(ModalContext);
	if (!context) {
		throw new Error("[useModal] useModal must be used within a ModalProvider");
	}

	return {
		openModal: context.openModal,
		closeModal: context.closeModal
	};
};

export default useModal;
