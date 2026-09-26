import styled from '@emotion/styled'
import { Link, useSearchParams } from 'react-router'
import Story from './components/story'
import { Main } from './components/main'
import { ListItemShimmer } from './components/shimmer'
import useFetch from './hooks/useFetch'
import {
  firstItemIndex,
  getPage,
  itemURI,
  pageCount,
  paginateData,
  typeURI,
  type StoryData,
  type StoryType,
} from '@repo/hn-core'

interface StoriesProps {
  type: StoryType
}

const List = styled.ol`
  padding-left: 28px;
  margin: 0;
`

const SeeMore = styled.div`
  margin-top: 15px;
  margin-left: 32px;
`

const Container = styled.li`
  color: var(--gray);

  & + & {
    margin-top: 10px;
  }

  @media only screen and (max-width: 400px) {
    font-size: 13px;
  }
`

const StoryRenderer = ({ id }: { id: number }) => {
  const { data } = useFetch<StoryData>(itemURI(id))
  return data ? (
    <Container>
      <Story data={data} showText={false} />
    </Container>
  ) : (
    <ListItemShimmer />
  )
}

export default function Stories({ type }: StoriesProps) {
  const [params] = useSearchParams()
  const response = useFetch<number[]>(typeURI(type))

  const page = getPage(params.get('page'))
  const data = response.data || []

  return (
    <Main aria-label={type}>
      <List start={firstItemIndex(page)}>
        {paginateData(data, page).map((id) => (
          <StoryRenderer key={id} id={id} />
        ))}
      </List>
      {page < pageCount(data.length) && (
        <SeeMore>
          <Link to={`/${type}?page=${page + 1}`} rel="noreferrer">
            Next Page
          </Link>
        </SeeMore>
      )}
    </Main>
  )
}
