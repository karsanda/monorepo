import styled from '@emotion/styled'
import { Link, useSearchParams } from 'react-router-dom'
import Story from './components/story'
import { Main } from './app'
import { ListItemShimmer } from './components/shimmer'
import useFetch from './hooks/useFetch'
import { getPage, paginateData, PAGE_SIZE } from './utils/pagination'
import { itemURI, typeURI } from './utils/api-list'

interface StoriesProps {
  type: 'topstories' | 'newstories' | 'beststories' | 'askstories' | 'showstories' | 'jobstories'
}

const List = styled.ol`
  padding-left: 28px;
  margin: 0;
`

const SeeMore = styled.div`
  margin-top: 15px;
  margin-left: 32px;
`

export const Container = styled.li`
  color: var(--gray);

  & + & {
    margin-top: 10px;
  }

  @media only screen and (max-width: 400px) {
    font-size: 13px;
  }
`

const StoryRenderer = ({ id }: { id: string }) => {
  const { data } = useFetch<StoryData>(itemURI(id))
  return data
    ? <Container><Story data={data} showText={false} /></Container>
    : <ListItemShimmer />
}

export default function Stories({ type }: StoriesProps) {
  const [ params ] = useSearchParams()
  const response = useFetch<string[]>(typeURI(type))

  const page = getPage(params)
  const data = response.data || []

  return (
    <Main aria-label={type}>
      <List start={(page * 30) - 29}>
        {paginateData(data, page).map((id: string) => <StoryRenderer key={id} id={id} />)}
      </List>
      {page < Math.ceil(data.length / PAGE_SIZE) && (
        <SeeMore>
          <Link to={`/${type}?page=${page + 1}`} rel="noreferrer">Next Page</Link>
        </SeeMore>
      )}
    </Main>
  )
}
