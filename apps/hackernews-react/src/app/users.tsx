import styled from '@emotion/styled'
import { format } from 'date-fns'
import { useState } from 'react'
import { useParams } from 'react-router-dom'
import Story from './story'
import Comment from './comment'
import useFetch from '../hooks/useFetch'

interface UserData {
  id: string
  created: number
  karma: number
  about?: string
  submitted?: string[]
}

type ItemFilter = 'STORIES' | 'COMMENTS' | 'NONE'

interface ItemProps {
  id: string
  showText?: boolean
  filter?: ItemFilter
}

const Main = styled.main`
  padding: 10px 5px;
  min-height: calc(100vh - 97px);
`

const Grid = styled.div`
  margin-left: 5px;
  display: grid;
  grid-template-columns: 80px calc(100% - 80px);
`

const About = styled.span`
  word-break: break-word;
`

const Submissions = styled.div`
  margin-top: 15px;

  & > h4 {
    margin-left: 5px;
    margin-bottom: 10px;
  }
`

const TabButton = styled.button`
  background: transparent;
  outline: none;
  border: none;
  margin-bottom: 10px;
  cursor: pointer;
  line-height: 1em;

  & + & {
    border-left: 1px solid var(--secondary-color);
  }

  & + article {
    margin-top: 0;
  }

  &.active {
    font-weight: 700;
  }
`

const List = styled.ol`
  margin: 0;
  padding-left: 28px;

  li + li {
    margin-top: 10px;
  }
`

const CommentList = styled.li`
  list-style: '▲';

  &::marker {
    font-size: 11px;
    color: var(--gray);
  }
`

function SubmissionRenderer({ id, showText = false, filter='NONE' }: ItemProps) {
  const { data } = useFetch<ItemData>(`item/${id}`)
  if (!data) return null

  switch(data.type) {
    case 'story':
      if (filter === 'COMMENTS') return null
      return <Story data={data} showText={showText} />
    case 'comment':
      if (filter === 'STORIES') return null
      return (
        <CommentList>
          <Comment data={data} disableChildren={filter === 'COMMENTS'} showParent />
        </CommentList>
      )
    default:
      return null
  }
}

function Users() {
  const { userid } = useParams()
  const { data } = useFetch<UserData>(`user/${userid}`)
  const [filter, setFilter] = useState<ItemFilter>('STORIES')

  if (!data) return <Main /> 
  const { id, created, karma, about, submitted } = data

  return (
    <Main>
      <Grid>
        <span>User:</span><span>{id}</span>
        <span>Karma:</span><span>{karma}</span>
        <span>Created:</span><span>{format(created * 1000, 'MMMM dd, yyyy')}</span>
        {about && <>
          <span>About:</span>
          <About dangerouslySetInnerHTML={{ __html: about }} />
        </>}
      </Grid>
      <Submissions data-filter={filter}>
        <TabButton onClick={() => setFilter('STORIES')} className={filter === 'STORIES' ? 'active' : undefined }>
          Submissions
        </TabButton>
        <TabButton onClick={() => setFilter('COMMENTS')} className={filter === 'COMMENTS' ? 'active' : undefined}>
          Comments
        </TabButton>
        <List>
          {(submitted && submitted.length > 0) && submitted.map(item => (
            <SubmissionRenderer key={item} id={item} filter={filter} />
          ))}
        </List>
      </Submissions>
    </Main>
  )
}

export default Users
