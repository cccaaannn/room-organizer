import { createFileRoute, redirect, useNavigate } from "@tanstack/react-router";
import { toast } from "react-toastify";
import { z } from "zod";

import AppForm from "@/components/form/app-form";
import GenericError from "@/components/generic-error";
import { useAppForm } from "@/hooks/useAppForm";
import { signIn } from "@/lib/auth-client";
import { getCurrentUser } from "@/middlewares/current-user-middleware";


const SigninScheme = z.object({
	email: z.string().email({ message: "Invalid email address" }).min(1, { message: "Email is required" }),
	password: z.string().min(1, { message: "Password is required" }).max(250, { message: "Name must be less than 250 characters" })
});

export const Route = createFileRoute("/auth/signin/")({
	component: Signup,
	errorComponent: () => <GenericError />,
	beforeLoad: async () => {
		try {
			const userResponse = await getCurrentUser();
			if (userResponse.result.user) {
				redirect({
					to: "/",
					throw: true
				});
			}
		}
		catch (error) {
			console.debug("Error fetching current user:", error);
		}
	}
});

function Signup() {

	const navigate = useNavigate();

	const form = useAppForm({
		defaultValues: {
			email: "",
			password: ""
		},
		validators: {
			onChange: SigninScheme
		},
		onSubmit: async ctx => {
			const result = await signIn.email({
				email: ctx.value.email,
				password: ctx.value.password
			});

			if (result.error) {
				toast(`Sign in failed: ${result.error.message}`);
				return;
			}

			toast("Signed in");
			navigate({ to: "/" });
		}
	});

	return (
		<div className="text-left h-full flex items-center justify-center">
			<div
				className="flex flex-col gap-4 bg-background rounded-lg border p-6 shadow-lg sm:max-w-lg w-full"
			>
				<h1 className="text-2xl font-bold mb-4">Sign In</h1>

				<AppForm handleSubmit={form.handleSubmit}>
					<form.AppField name="email">
						{field => <field.TextField label="Email" />}
					</form.AppField>

					<form.AppField name="password">
						{field => <field.PasswordTextField label="Password" />}
					</form.AppField>

					<div className="flex justify-end gap-2">
						<form.AppForm>
							<form.Button
								label="Save"
							/>
						</form.AppForm>
					</div>
				</AppForm>
			</div>
		</div>
	);
}
