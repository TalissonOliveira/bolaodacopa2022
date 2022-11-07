import Image from 'next/image'
import { FormEvent, useState } from 'react'
import { toast } from 'react-toastify'
import usersAvatarExampleImg from '../assets/users-avatar-example.png'
import appPreviewImg from '../assets/app-nlw-copa-preview.png'
import iconCheckImg from '../assets/icon-check.svg'
import logoImg from '../assets/logo.svg'
import { api } from '../lib/axios'

interface HomeProps {
  poolCount: number
  guessCount: number
  userCount: number
}

export default function Home({ poolCount, guessCount, userCount }: HomeProps) {
  const [poolTitle, setPoolTitle] = useState('')

  async function handleCreatePool(event: FormEvent) {
    event.preventDefault()

    try {
      const response = await api.post('/pools', {
        title: poolTitle
      })

      const { code } = response.data

      await navigator.clipboard.writeText(code)
      setPoolTitle('')

      toast.success(`Bolão criado com sucesso! O código ${code} foi copiado para área de transferência`, {
        autoClose: 8000
      })

    } catch (error) {
      toast.error('Falha ao criar o bolão, tente novamente!')
    }
  }

  return (
    <div className="max-w-[1124px] h-screen items-center grid grid-cols-2 gap-28 mx-auto">
      <main>
        <Image src={logoImg} alt="NLW Copa" />
        <h1 className="mt-14 text-white text-5xl font-bold leading-tight">
          Crie seu próprio bolão da copa e compartilhe entre amigos!
        </h1>

        <div className="flex items-center gap-2 mt-10">
          <Image src={usersAvatarExampleImg} alt="" />

          <strong className="text-gray-100">
            <span className="text-ignite-500 text-xl">
              +{userCount}
            </span>
            {' '}pessoas já estão usando
          </strong>
        </div>

        <form onSubmit={handleCreatePool} className="flex gap-2 mt-10">
          <input
            className="bg-gray-800 flex-1 px-6 py-4 text-sm border border-gray-600 rounded text-gray-100"
            type="text"
            placeholder="Qual o nome do seu bolão?"
            value={poolTitle}
            onChange={event => setPoolTitle(event.target.value)}
            required
          />
          <button
            type="submit"
            className="bg-yellow-500 px-6 py-4 rounded text-gray-900 text-sm uppercase font-bold transition-colors hover:bg-yellow-700"
          >
            Criar meu bolão
          </button>
        </form>
        <p className="text-gray-300 mt-4 text-sm leading-relaxed">
          Após criar seu bolão, você receberá um código único que poderá usar para convidar outras pessoas 🚀
        </p>

        <div className="flex items-center justify-between mt-10 pt-10 border-t border-gray-600 text-gray-100">
          <div className="flex items-center gap-6">
            <Image src={iconCheckImg} alt="" />
            <div className="flex flex-col">
              <span className="text-2xl font-bold">+{poolCount}</span>
              <span>Bolões criados</span>
            </div>
          </div>

          <div className="w-px h-[62px] bg-gray-600" />

          <div className="flex items-center gap-6">
            <Image src={iconCheckImg} alt="" />
            <div className="flex flex-col">
              <span className="text-2xl font-bold">+{guessCount}</span>
              <span>Palpites enviados</span>
            </div>
          </div>
        </div>
      </main>

      <Image
        src={appPreviewImg}
        alt="Dois celulares exibindo uma prévia da aplicação móvel do NLW Copa"
        quality={100}
      />
    </div>
  )
}

export const getServerSideProps = async () => {
  const [
    poolCountResponse,
    guessCountResponse,
    userCountResponse
  ] = await Promise.all([
    api.get('/pools/count'),
    api.get('/guesses/count'),
    api.get('/users/count')
  ])

  return {
    props: {
      poolCount: poolCountResponse.data.count,
      guessCount: guessCountResponse.data.count,
      userCount: userCountResponse.data.count
    }
  }
}