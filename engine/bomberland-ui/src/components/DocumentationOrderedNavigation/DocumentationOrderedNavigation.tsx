import { graphql, useStaticQuery } from "gatsby";
import * as React from "react";
import { useMemo } from "react";
import { IOrderedPageNavigation, OrderedNavigation } from "./OrderedNavigation";
interface IGraphQLEdge {
    readonly node: {
        readonly timeToRead: number;
        readonly frontmatter: {
            readonly slug: string;
            readonly title: string;
            readonly description: string;
            readonly order: number;
        };
    };
}

const getPreviousNode = (nodes: Array<IOrderedPageNavigation>, index: number) => {
    return index > 0 ? nodes[nodes.length - 1] : null;
};

const updateNextNodeOfPrevious = (nodes: Array<IOrderedPageNavigation>, index: number) => {
    if (index > 0) {
        const previousNode = nodes[index - 1];
        nodes[index - 1] = { ...previousNode, next: nodes[index] };
    }
};

const generateLinkedListFromOrderedEdges = (edges: Array<IGraphQLEdge>) => {
    const list: Array<IOrderedPageNavigation> = [];
    edges.forEach((edge, index) => {
        const { timeToRead } = edge.node;
        const { slug, title, description, order } = edge.node.frontmatter;
        const previous = getPreviousNode(list, index);
        const listNode: IOrderedPageNavigation = { timeToRead, slug, title, description, order, previous, next: null };
        list.push(listNode);
        updateNextNodeOfPrevious(list, index);
    });
    return list;
};

interface IProps {
    readonly currentPageOrder: number;
}

export const DocumentationOrderedNavigation: React.FC<IProps> = ({ currentPageOrder }) => {
    const data = useStaticQuery(graphql`
        {
            allMarkdownRemark(
                sort: { order: ASC, fields: [frontmatter___order] }
                filter: { fileAbsolutePath: { regex: "/(src/source-filesystem/docs)/" } }
            ) {
                edges {
                    node {
                        timeToRead
                        frontmatter {
                            slug
                            title
                            description
                            order
                        }
                    }
                }
            }
        }
    `);
    const navigationMap = useMemo(() => {
        const linkedList = generateLinkedListFromOrderedEdges(data.allMarkdownRemark.edges);
        const map: { [orderId: number]: IOrderedPageNavigation } = {};
        linkedList.forEach((item) => {
            map[item.order] = item;
        });
        return map;
    }, [data]);
    const currentPageNavigation = navigationMap[currentPageOrder];

    return <OrderedNavigation pageNavigation={currentPageNavigation} />;
};
