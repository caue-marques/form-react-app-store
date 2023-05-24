import { useMutation } from 'react-apollo'
import { useProduct } from 'vtex.product-context'
import React, { FormEvent, useState } from 'react'

import SendReview from '../graphql/queries/sendFormReview.gql'

const SendReviewForm: StorefrontFunctionComponent = () => {
  const productContextValue = useProduct()

  const [data] = useMutation(SendReview)

  // utilizar caso não seja utilizado o useProduct()

  // const [produto, setProduto] = useState('');

  const [date, setDate] = useState('')
  const [usuario, setUsuario] = useState('')
  const [nota, setNota] = useState('')
  const [comentario, setComentario] = useState('')
  const [sucesso, setSucesso] = useState(false)
  const [produtoVazio, setProdutoVazio] = useState(false)
  const [dataVazia, setDataVazia] = useState(false)
  const [usuarioVazio, setUsuarioVazio] = useState(false)
  const [notaVazia, setNotaVazia] = useState(false)

  const sendReview = async (e: FormEvent) => {
    e.preventDefault()
    setSucesso(false)

    const productIsEmpty = false
    let dataIsEmpty = false
    let usuarioIsEmpty = false
    let notaIsEmpty = false

    // utilizar caso não seja utilizado o useProduct()

    // if (!produto)
    //     productIsEmpty = true

    if (!date) dataIsEmpty = true

    if (!usuario) usuarioIsEmpty = true

    if (!nota) notaIsEmpty = true

    setProdutoVazio(productIsEmpty)
    setDataVazia(dataIsEmpty)
    setUsuarioVazio(usuarioIsEmpty)
    setNotaVazia(notaIsEmpty)

    // incluir !produto caso não seja utilizado o useProduct()
    if (!date || !usuario || !nota) return

    data({
      variables: {
        dataEntity: 'Reviews',
        account: 'estagioacct',
        schema: 'Reviews',
        document: {
          document: {
            userName: usuario,
            data: date,
            nota,
            comentario,
            produto: productContextValue?.selectedItem?.itemId,
          },
        },
      },
    }).then((dados) => {
      setSucesso(true)
    })

    // await fetch(`/api/dataentities/Reviews/documents?_schema=Reviews`, {
    //     headers: {
    //         "Content-Type": "application/json"
    //     },
    //     method: "POST",
    //     body: JSON.stringify({
    //         //utilizar produto caso não seja utilizad o useProduct()
    //         'produto': productContextValue?.selectedItem?.itemId,
    //         'data': date,
    //         'usuario': usuario,
    //         'nota': nota,
    //         'comentario': comentario
    //     })
    // })
    //     .then(data => {
    //         return data.json()
    //     })
    //     .then(() => {
    //         setSucesso(true)
    //     })
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
        {produtoVazio && <div className="f6 lh-copy tc red b">Campo Vazio</div>}

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
        {dataVazia && <div className="f6 lh-copy tc  red b">Campo Vazio</div>}

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
          <div className="f6 lh-copy tc  red b">Campo Vazio</div>
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
        {notaVazia && <div className="f6 lh-copy tc red b">Campo Vazio</div>}

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
