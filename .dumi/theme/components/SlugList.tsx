import type { FC } from 'react';
import React from 'react';
import { AnchorLink } from 'dumi/theme';
import './SlugList.less';

const SlugsList: FC<{ slugs: any; className?: string; maxDepth?: number }> = ({
  slugs,
  maxDepth = 4,
  ...props
}) => (
  <ul role="slug-list" {...props}>
    {slugs
      .filter(({ depth }) => depth > 1 && depth < maxDepth)
      .map((slug) => (
        <li key={slug.heading} title={slug.value} data-depth={slug.depth}>
          <AnchorLink to={`#${slug.heading}`}>
            <span>{slug.value}</span>
          </AnchorLink>
        </li>
      ))}
  </ul>
);

export default SlugsList;
