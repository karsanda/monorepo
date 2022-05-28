import styled from '@emotion/styled'
import { Link, useSearchParams } from "react-router-dom"
import Story from './story'
import useFetch from '../hooks/useFetch'
import { getPage, paginateData, PAGE_SIZE } from '../utils'

interface StoriesProps {
  type: 'topstories' | 'newstories' | 'beststories'
}

const Main = styled.main`
  padding: 10px 5px;
  min-height: calc(100vh - 116px);
`

const LinkMore = styled.div`
  margin-top: 15px;
  margin-left: 25px;
`

function Stories({ type }: StoriesProps) {
  const response = useFetch<string[]>(type)
  const [params] = useSearchParams()
  const page = getPage(params)

  const data = response.data || []
  const renderedData = paginateData(data, page)
  const calcIndex = (index: number) => (30 * (page - 1)) + (index + 1)
  return (
    <Main>
      {renderedData.map((id: string, index) => <Story index={calcIndex(index)} key={id} id={id} />)}
      {page < Math.ceil(data.length / PAGE_SIZE) && (
        <LinkMore>
          <Link to={`/${type}?page=${page + 1}`} rel="noreferrer">More</Link>
        </LinkMore>
      )}
    </Main>
  )
}

export default Stories
