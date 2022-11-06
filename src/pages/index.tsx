import { GetServerSideProps } from 'next'

interface HomeProps {
  count: number
}

export default function Home({ count }: HomeProps) {
  return (
    <div className="text-violet-500">{count}</div>
  )
}

export const getServerSideProps: GetServerSideProps = async () => {
  const response = await fetch('http://localhost:3333/pools/count')
  const data = await response.json()

  return {
    props: {
      count: data.count
    }
  }
}
