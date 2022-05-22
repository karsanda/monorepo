import styled from '@emotion/styled';
import useFetch from '../hooks/useFetch';
import Item from './item';

const Header = styled.header`
  padding: 5px 10px;
  background-color: var(--dark-bg);
  color: var(--primary-color);
`;

const Main = styled.main`
  padding: 10px 15px 15px 0;
  min-height: calc(100vh - 116px);
`;

const Footer = styled.main`
  border-top: 1px solid #cccccc;
  margin: 0 15px;
  padding: 10px 0;
  text-align: center;
  font-size: 0.8em;
`;

const List = styled.ol`
  margin: 0;
`;

function App() {
  const { data } = useFetch<string[]>('topstories');
  return (
    <>
      <Header>
        <h1>HN - React</h1>
      </Header>
      <Main>
        <List>
          {data?.splice(0, 30).map((id) => (
            <Item key={id} id={id} />
          ))}
        </List>
      </Main>
      <Footer>
        ©{new Date().getFullYear()} Karsanda |{' '}
        <a href="https://github.com/karsanda/monorepo/tree/main/apps/hn-react">
          HN - React
        </a>
      </Footer>
    </>
  );
}

export default App;
