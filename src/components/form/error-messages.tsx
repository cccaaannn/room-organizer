const ErrorMessages = ({ errors }: { errors: Array<string | { message: string }> }) => {
	return (
		<>
			{
				errors.map(error =>
					<div
						key={typeof error === "string" ? error : error.message}
						className="text-red-500 mt-1 text-sm"
					>
						{typeof error === "string" ? error : error.message}
					</div>
				)
			}
		</>
	);
};

export default ErrorMessages;
