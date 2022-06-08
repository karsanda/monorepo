import styled from '@emotion/styled'
import { useParams } from 'react-router-dom'
import Item from './item'
import useFetch from '../hooks/useFetch'

interface ItemData {
  kids: number[]
}

const Main = styled.main`
  padding: 10px 5px;
  min-height: calc(100vh - 97px);
`

const CommentsList = styled.section`
  margin-left: 25px;
  margin-top: 30px;
`

function Comments() {
  const params = useParams()
  const { data } = useFetch<ItemData>(`item/${params['itemid']}`)

  if (!params || !params['itemid'] || !data) return <Main />

  const { kids } = data
  return (
    <Main>
      <Item id={params['itemid']} showText />
      <CommentsList>
        {kids && kids.map(kid => <Item id={kid.toString()} key={kid} />)}
      </CommentsList>
    </Main>
  )
}

export default Comments
