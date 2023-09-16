import styled from '@emotion/styled'
import { format } from 'date-fns'
import { useState } from 'react'
import { useParams } from 'react-router-dom'
import Story from './components/story'
import Comment from './components/comment'
import { Main } from './app'
import useFetch from './hooks/useFetch'
import { itemURI, userURI } from './utils/api-list'

type SubmissionFilter = 'STORIES' | 'COMMENTS'

interface SubmissionProps {
  id: string
  filter?: SubmissionFilter
}

const Grid = styled.div`
  margin-left: 5px;
  display: grid;
  grid-template-columns: 80px calc(100% - 80px);

  @media only screen and (max-width: 400px) {
    font-size: 12px;
  }
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

const CommentItem = styled.li`
  list-style: '▲';

  &::marker {
    font-size: 11px;
    color: var(--gray);
  }
`

function Submission({ id, filter }: SubmissionProps) {
  const { data } = useFetch<StoryData | CommentData>(itemURI(id))

  if (!data) return null

  switch(data.type) {
    case 'story':
      return filter !== 'COMMENTS' ? <Story data={data} showText={false} /> : null
    case 'comment':
      return filter !== 'STORIES' ? (
        <CommentItem>
          <Comment data={data} disableChildren={filter === 'COMMENTS'} showParent />
        </CommentItem>
      ) : null
    default:
      return null
  }
}

export default function Users() {
  const { userid } = useParams()
  const { data } = useFetch<UserData>(userURI(userid))
  const [filter, setFilter] = useState<SubmissionFilter>('STORIES')

  if (!data) return <Main aria-label='user' />

  const { id, created, karma, about, submitted } = data

  const switchTab = (state: SubmissionFilter) => () => setFilter(state)
  const setActiveClass = (state: SubmissionFilter) => filter === state ? 'active' : undefined

  return (
    <Main aria-label='user'>
      <Grid>
        <span>User:</span><span>{id}</span>
        <span>Karma:</span><span>{karma}</span>
        <span>Created:</span><span>{format(created * 1000, 'MMMM dd, yyyy')}</span>
        {about && <><span>About:</span><About dangerouslySetInnerHTML={{ __html: about }} /></>}
      </Grid>
      <Submissions data-filter={filter}>
        <TabButton onClick={switchTab('STORIES')} className={setActiveClass('STORIES')}>
          Submissions
        </TabButton>
        <TabButton onClick={switchTab('COMMENTS')} className={setActiveClass('COMMENTS')}>
          Comments
        </TabButton>
        <List>
          {(submitted && submitted.length > 0) && submitted.map(item => (
            <Submission key={item} id={item} filter={filter} />
          ))}
        </List>
      </Submissions>
    </Main>
  )
}
