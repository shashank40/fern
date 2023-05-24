import { NonIdealState } from "@blueprintjs/core";
import { assertNever } from "@fern-api/core-utils";
import { useLocation } from "react-router-dom";
import { ApiDefinitionContextProvider } from "../api-context/ApiDefinitionContextProvider";
import { ApiPage } from "../api-page/ApiPage";
import { useDocsContext } from "../docs-context/useDocsContext";
import { MarkdownPage } from "../markdown-page/MarkdownPage";
import { RedirectToFirstApiItem } from "./RedirectToFirstApiItem";
import { RedirectToFirstNavigationItem } from "./RedirectToFirstNavigationItem";

export const DocsMainContent: React.FC = () => {
    const location = useLocation();
    const { resolvedPathFromUrl, docsDefinition } = useDocsContext();

    if (resolvedPathFromUrl == null) {
        if (location.pathname === "/") {
            return <RedirectToFirstNavigationItem items={docsDefinition.config.navigation.items} slug="" />;
        }
        return <NonIdealState title="404" />;
    }

    switch (resolvedPathFromUrl.type) {
        case "page":
            return <MarkdownPage path={resolvedPathFromUrl} />;
        case "api":
            return (
                <ApiDefinitionContextProvider
                    apiSection={resolvedPathFromUrl.apiSection}
                    apiSlug={resolvedPathFromUrl.slug}
                >
                    <RedirectToFirstApiItem />
                </ApiDefinitionContextProvider>
            );
        case "apiSubpackage":
        case "endpoint":
        case "topLevelEndpoint":
            return (
                <ApiDefinitionContextProvider
                    apiSection={resolvedPathFromUrl.apiSection}
                    apiSlug={resolvedPathFromUrl.apiSlug}
                >
                    <ApiPage />
                </ApiDefinitionContextProvider>
            );
        case "section":
            return (
                <RedirectToFirstNavigationItem
                    items={resolvedPathFromUrl.section.items}
                    slug={resolvedPathFromUrl.slug}
                />
            );
        default:
            assertNever(resolvedPathFromUrl);
    }
};