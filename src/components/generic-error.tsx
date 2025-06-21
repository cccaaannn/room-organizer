const GenericError = () => {
	return (
		<div className="text-center h-full">
			<div className="h-full flex flex-col items-center justify-center gap-2">
				<h1 className="text-2xl font-bold">Error</h1>

				<p className="text-gray-500">An unexpected error has occurred.</p>
			</div>
		</div>
	);
};

export default GenericError;
