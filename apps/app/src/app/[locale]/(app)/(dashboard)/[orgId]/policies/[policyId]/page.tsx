import PageWithBreadcrumb from "@/components/pages/PageWithBreadcrumb";
import { getI18n } from "@/locales/server";
import type { Metadata } from "next";
import { setStaticParamsLocale } from "next-international/server";
import { JSONContent } from "novel";
import { Comments } from "../../components/comments/Comments";
import { PolicyOverview } from "./components/PolicyOverview";
import { PolicyPageEditor } from "./editor/components/PolicyDetails";
import {
	getArtifactsCreatedFromPolicy,
	getAssignees,
	getComments,
	getPolicy,
} from "./data";

export default async function PolicyDetails({
	params,
}: {
	params: Promise<{ locale: string; policyId: string; orgId: string }>;
}) {
	const { locale, policyId, orgId } = await params;

	setStaticParamsLocale(locale);
	const policy = await getPolicy(policyId);
	const assignees = await getAssignees();
	const comments = await getComments(policyId);
	const { mappedControls, allControls } =
		await getArtifactsCreatedFromPolicy(policyId);

	return (
		<PageWithBreadcrumb
			breadcrumbs={[
				{ label: "Policies", href: `/${orgId}/policies/all` },
				{ label: policy?.name ?? "Policy", current: true },
			]}
		>
			<PolicyOverview
				policy={policy ?? null}
				assignees={assignees}
				mappedControls={mappedControls}
				allControls={allControls}
			/>
			<PolicyPageEditor
				policyId={policyId}
				policyContent={
					policy?.content ? (policy.content as JSONContent[]) : []
				}
			/>
			<Comments
				entityId={policyId}
				comments={comments}
				entityType="policy"
			/>
		</PageWithBreadcrumb>
	);
}

export async function generateMetadata({
	params,
}: {
	params: Promise<{ locale: string; policyId: string }>;
}): Promise<Metadata> {
	const { locale } = await params;

	setStaticParamsLocale(locale);
	const t = await getI18n();

	return {
		title: t("policies.overview.title"),
	};
}
