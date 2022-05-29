import styled from '@emotion/styled'
import { format } from 'date-fns'
import { useParams } from 'react-router-dom'
import useFetch from '../hooks/useFetch'

interface UserData {
  id: string;
  created: number;
  karma: number;
  about?: string;
  submitted?: string[];
}

const Main = styled.main`
  padding: 10px 5px;
  min-height: calc(100vh - 97px);
`

const Grid = styled.div`
  display: grid;
  grid-template-columns: 80px calc(100% - 80px);
`

const About = styled.span`
  word-break: break-word;
`

function Users() {
  const params = useParams()
  const { data } = useFetch<UserData>(`user/${params['userid']}`)

  if (!data) return <Main /> 

  const { id, created, karma, about } = data
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
    </Main>
  )
}

export default Users
