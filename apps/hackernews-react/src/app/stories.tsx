import styled from '@emotion/styled'
import { Link, useSearchParams } from 'react-router-dom'
import Story from './story'
import { StoryShimmer } from './shimmer'
import useFetch from '../hooks/useFetch'
import { getPage, paginateData, PAGE_SIZE } from '../utils'

interface StoriesProps {
  type: 'topstories' | 'newstories' | 'beststories' | 'askstories' | 'showstories' | 'jobstories'
}

const List = styled.ol`
  padding-left: 28px;
  margin: 0;
`

const LinkMore = styled.div`
  margin-top: 15px;
  margin-left: 32px;
`

function StoryRenderer({ id }: { id: string }) {
  const { data } = useFetch<ItemData>(`item/${id}`)
  if (!data) return <StoryShimmer />

  return <Story data={data} showText={false} />
}

function Stories({ type }: StoriesProps) {
  const response = useFetch<string[]>(type)
  const [ params ] = useSearchParams()
  const page = getPage(params)

  const data = response.data || []
  const renderedData = paginateData(data, page)
  return (
    <>
      <List start={(page * 30) - 29}>
        {renderedData.map((id: string) => <StoryRenderer key={id} id={id} />)}
      </List>
      {page < Math.ceil(data.length / PAGE_SIZE) && (
        <LinkMore>
          <Link to={`/${type}?page=${page + 1}`} rel="noreferrer">More</Link>
        </LinkMore>
      )}
    </>
  )
}

export default Stories
