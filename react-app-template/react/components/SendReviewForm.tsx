import { useMutation } from 'react-apollo'
import { useProduct } from 'vtex.product-context'
import React, { FormEvent, useState } from 'react'

import SEND_FORM_REVIEW from '../graphql/queries/SEND_FORM_REVIEW.gql'

const SendReviewForm: StorefrontFunctionComponent = () => {
  const productContextValue = useProduct()

  const [sendForm] = useMutation(SEND_FORM_REVIEW)

  const [date, setDate] = useState('')
  const [usuario, setUsuario] = useState('')
  const [nota, setNota] = useState('')
  const [comentario, setComentario] = useState('')
  const [sucesso, setSucesso] = useState(false)
  const [produtoVazio, setProdutoVazio] = useState(false)
  const [dataVazia, setDataVazia] = useState(false)
  const [usuarioVazio, setUsuarioVazio] = useState(false)
  const [notaVazia, setNotaVazia] = useState(false)

  const resetStates = () => {
    setSucesso(false)
    setDataVazia(false)
    setUsuarioVazio(false)
    setNotaVazia(false)
  }

  const sendReview = async (e: FormEvent) => {
    e.preventDefault()

    resetStates()

    if (!productContextValue?.selectedItem?.itemId) {
      setProdutoVazio(true)
      return
    }

    if (!date) setDataVazia(true)

    if (!usuario) setUsuarioVazio(true)

    if (!nota) setNotaVazia(true)

    if (!nota || !usuario || !date) return

    try {
      await sendForm({
        variables: {
          dataEntity: 'Teste4Reviews',
          account: 'estagioacct',
          schema: 'Ratings',
          document: {
            document: {
              usuario: usuario,
              data: date,
              nota,
              comentario,
              produto: productContextValue?.selectedItem?.itemId,
            },
          },
        },
      })

      setSucesso(true)
    } catch (e) {
      setSucesso(false)
    }
  }

  return (
    <div>
      <form className="mt7 w-50 flex center flex-column items-center">
        <label className="db mb2" htmlFor="sku">
          Produto avaliado:
        </label>
        <input
          className="w-25 h2 ba b--black-80 db mb2"
          type="text"
          value={productContextValue?.selectedItem?.itemId}
          name="sku"
          id="sku"
          placeholder="Produto"
          disabled
        />
        {produtoVazio && (
          <div className="f6 lh-copy tc red b">
            Você não está em um contexto de produto
          </div>
        )}

        <label className="db mb2" htmlFor="data">
          Data:
        </label>
        <input
          className="db mb2 w-25 h2 ba b--black-80"
          type="date"
          value={date}
          name="data"
          id="data"
          placeholder="Data da avaliação"
          onChange={(e) => setDate(e.target.value)}
        />
        {dataVazia && (
          <div className="f6 lh-copy tc  red b">
            Campo data deve ser preenchido
          </div>
        )}

        <label className="db mb2" htmlFor="sku">
          Usuário:
        </label>
        <input
          className="db mb2 w-25 h2 ba b--black-80"
          type="text"
          value={usuario}
          name="usuario"
          id="usuario"
          placeholder="Usuário"
          onChange={(e) => setUsuario(e.target.value)}
        />
        {usuarioVazio && (
          <div className="f6 lh-copy tc  red b">
            Campo usuário deve ser preenchido
          </div>
        )}

        <label className="db mb2" htmlFor="sku">
          Nota:
        </label>
        <input
          className="db mb2 w-25 h2 ba b--black-80"
          type="number"
          value={nota}
          name="nota"
          id="nota"
          placeholder="Nota"
          onChange={(e) => setNota(e.target.value)}
        />
        {notaVazia && (
          <div className="f6 lh-copy tc red b">
            Campo nota deve ser preenchido
          </div>
        )}

        <label className="db mb2" htmlFor="sku">
          Comentário:
        </label>
        <input
          className="db mb2 w-25 h2 ba b--black-80"
          type="textarea"
          value={comentario}
          name="comentario"
          id="comentario"
          placeholder="Comentário"
          onChange={(e) => setComentario(e.target.value)}
        />

        <button
          type="submit"
          className="mt6 pointer ml5 h2 bg-green ba b--black-10"
          onClick={sendReview}
        >
          Enviar Review
        </button>
      </form>

      <div>
        {sucesso && (
          <div className="tc mt5 blue b">Review enviada com sucesso</div>
        )}
      </div>
    </div>
  )
}

export default SendReviewForm
