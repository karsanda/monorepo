import styled from '@emotion/styled'
import { format } from 'date-fns'
import { useState } from 'react';
import { useParams } from 'react-router-dom'
import useFetch from '../hooks/useFetch'
import Item from './item';

interface UserData {
  id: string;
  created: number;
  karma: number;
  about?: string;
  submitted?: string[];
}

type ItemFilter = 'STORIES' | 'COMMENTS' | 'NONE'

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

  &[data-filter="STORIES"] > article {
    margin-left: -20px;
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
`

function Users() {
  const { userid } = useParams()
  const { data } = useFetch<UserData>(`user/${userid}`)
  const [filter, setFilter] = useState<ItemFilter>('STORIES')

  if (!data) return <Main /> 

  const { id, created, karma, about, submitted } = data

  return (
    <Main>
      <Grid>
        <span>User:</span>
        <span>{id}</span>
        <span>Karma:</span>
        <span>{karma}</span>
        <span>Created:</span>
        <span>{format(created * 1000, 'MMMM dd, yyyy')}</span>
        {about && (
          <>
            <span>About:</span>
            <About dangerouslySetInnerHTML={{ __html: about }} />
          </>
        )}
      </Grid>
      <Submissions data-filter={filter}>
        <TabButton onClick={() => setFilter('STORIES')}>Submissions</TabButton>
        <TabButton onClick={() => setFilter('COMMENTS')}>Comments</TabButton>
        {(submitted && submitted.length > 0) && submitted.map(item => (
          <Item key={item} id={item} filter={filter} />
        ))}
      </Submissions>
    </Main>
  )
}

export default Users
