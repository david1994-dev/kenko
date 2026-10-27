import { Breadcrumbs, type Crumb } from "./breadcrumbs";
import { Container } from "./ui";

export function ContentPage({
  title,
  crumbs,
  lead,
  children,
}: {
  title: string;
  crumbs: Crumb[];
  lead?: string;
  children?: React.ReactNode;
}) {
  return (
    <Container className="max-w-3xl pb-10 pt-3 md:pt-5">
      <Breadcrumbs items={crumbs} />
      <h1 className="mb-2 mt-3 text-2xl font-extrabold leading-tight md:text-[32px]">{title}</h1>
      {lead && <p className="mb-5 text-base text-muted">{lead}</p>}
      <div className="space-y-4 text-[15px] leading-relaxed text-ink">{children}</div>
    </Container>
  );
}
