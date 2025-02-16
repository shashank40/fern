import { Text } from "@blueprintjs/core";
import classNames from "classnames";
import { useCallback, useEffect, useState } from "react";
import { useDocsContext } from "../docs-context/useDocsContext";
import { useIsSlugSelected } from "../docs-context/useIsSlugSelected";
import { SidebarItemLayout } from "./SidebarItemLayout";

export declare namespace NavigatingSidebarItem {
    export interface Props {
        title: JSX.Element | string;
        className?: string;
        slug: string;
        leftElement?: JSX.Element;
        rightElement?: JSX.Element;
    }
}

export const NavigatingSidebarItem: React.FC<NavigatingSidebarItem.Props> = ({
    title,
    className,
    slug,
    leftElement,
    rightElement,
}) => {
    const { navigateToPath, registerScrolledToPathListener } = useDocsContext();
    const handleClick = useCallback(() => {
        navigateToPath(slug);
    }, [navigateToPath, slug]);

    const isSelected = useIsSlugSelected(slug);

    const [wasRecentlySelected, setWasRecentlySelected] = useState(isSelected);
    useEffect(() => {
        if (isSelected) {
            setWasRecentlySelected(true);
            return;
        }

        setTimeout(() => {
            setWasRecentlySelected(false);
        }, 0);
    }, [isSelected]);

    const renderTitle = useCallback(
        ({ isHovering }: { isHovering: boolean }) => {
            return (
                <div
                    className={classNames("flex flex-1 items-center justify-between select-none min-w-0", {
                        "text-accentPrimary": isSelected,
                        "text-white": !isSelected && isHovering,
                        transition: !isSelected && !wasRecentlySelected,
                    })}
                >
                    <div className="flex min-w-0 items-center gap-2">
                        {leftElement}
                        <Text ellipsize>{title}</Text>
                    </div>
                    {rightElement}
                </div>
            );
        },
        [isSelected, leftElement, rightElement, title, wasRecentlySelected]
    );

    const [ref, setRef] = useState<HTMLElement | null>(null);
    useEffect(() => {
        if (ref == null) {
            return;
        }
        const unsubscribe = registerScrolledToPathListener(slug, () => {
            ref.scrollIntoView({
                block: "center",
            });
        });
        return unsubscribe;
    }, [ref, registerScrolledToPathListener, slug]);

    return (
        <div className={className} ref={setRef}>
            <SidebarItemLayout title={renderTitle} onClick={handleClick} isSelected={isSelected} />
        </div>
    );
};
