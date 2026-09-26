'use client'

import { useState, type ReactNode } from 'react'

interface Props {
  author: string
  header: ReactNode
  children: ReactNode
}

export function CommentToggle({ author, header, children }: Props) {
  const [collapsed, setCollapsed] = useState(false)

  return (
    <article className="comment">
      <div className="comment-header">
        <button
          className="collapse-button"
          type="button"
          aria-expanded={!collapsed}
          aria-label={`${collapsed ? 'Expand' : 'Collapse'} comment by ${author}`}
          onClick={() => setCollapsed(!collapsed)}
        >
          <span aria-hidden="true">{collapsed ? '▶' : '▼'}</span>
        </button>
        {header}
      </div>
      {!collapsed && children}
    </article>
  )
}
