import React, { FormEvent, Fragment, useState } from 'react'
import { useProduct } from 'vtex.product-context'
import { useQuery } from 'react-apollo'

import GET_SEARCHRECIPE from '../graphql/queries/GET_SEARCHRECIPE.gql'

interface DocumentsType {
  id: string
  fields: Array<{
    key: string
    value: string
  }>
}
interface Documents {
  documents: DocumentsType[]
}

const SearchSKUForm: StorefrontFunctionComponent = () => {
  const { data, loading, refetch } = useQuery<Documents>(GET_SEARCHRECIPE, {
    ssr: false,
    variables: {
      account: 'estagioacct',
      acronym: 'Receitas',
      fields: ['id', 'id_sku', 'titulo', 'data', 'conteudo', 'produtos'],
    },
  })

  const productContextValue = useProduct()

  const emptyFields = {
    id: '',
    id_sku: '',
    titulo: '',
    data: '',
    conteudo: '',
    produtos: '',
  }

  const [product, setProduct] = useState(emptyFields)

  const [id, setId] = useState('')
  const [idNotSent, setIdNotSent] = useState(false)
  const [notFound, setNotFound] = useState(false)

  const resetProduct = () => {
    setProduct(emptyFields)
  }

  const resetStatus = () => {
    setIdNotSent(false)
    setNotFound(false)
  }

  const searchSku = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    await refetch()

    resetProduct()
    resetStatus()

    if (!id) {
      setIdNotSent(true)
      return
    }

    if (!data || loading) {
      return
    }

    const productFinded = data?.documents.find(
      (doc) => doc.fields[1].value === id
    )

    if (!productFinded) {
      setNotFound(true)

      return
    }

    const findFieldValue = (key: string) => {
      return (
        productFinded.fields.find((productFields) => productFields.key === key)
          ?.value ?? ''
      )
    }

    const extractedFields = {
      id: findFieldValue('id'),
      id_sku: findFieldValue('id_sku'),
      titulo: findFieldValue('titulo'),
      data: findFieldValue('data'),
      conteudo: findFieldValue('conteudo'),
      produtos: findFieldValue('produtos'),
    }

    setProduct(extractedFields)

    // await fetch(`/api/dataentities/Receitas/search/?_fields=id_sku,titulo,data,conteudo,produtos`)
    //     .then(data => {
    //         return data.json()
    //     })
    //     .then(skus => {
    //         for (let sku of skus) {
    //             if (sku.produtos == id) {
    //                 searchProduct = sku
    //                 productFound = true
    //                 idNotSent = false
    //                 break
    //             }
    //         }

    //         setProduct(searchProduct)
    //         setNotFound(!productFound)
    //         setIdNotSent(idNotSent)
    //     })
  }

   const searchMostRecentSku = async (e: FormEvent) => {
     e.preventDefault()

     resetProduct()
     resetStatus()

     await refetch()

     if (!data || loading) {
      return
    }

    const mostRecenteReceipe = data?.documents.reduce((a,b) => a.fields[3].value > b.fields[3].value ? a : b).fields

    const findFieldValue = (key: string) => {
      return (
        mostRecenteReceipe.find((productFields) => productFields.key === key)
          ?.value ?? ''
      )
    }

    const extractedFields = {
      id: findFieldValue('id'),
      id_sku: findFieldValue('id_sku'),
      titulo: findFieldValue('titulo'),
      data: findFieldValue('data'),
      conteudo: findFieldValue('conteudo'),
      produtos: findFieldValue('produtos'),
    }

    setProduct(extractedFields)
   }

  return (
    <div>
      <form
        className="flex justify-center items-center mt6"
        onSubmit={searchSku}
      >
        <input
          className="w-25 h2 ba b--black-80"
          type="text"
          value={id}
          name="id_sku"
          id="id_sku"
          placeholder="ID DO SKU"
          onChange={(e) => setId(e.target.value)}
        />
        <button className="pointer ml5 h2 bg-green ba b--black-10">
          Buscar Receita
        </button>

        <button
          type="submit"
          className="pointer ml5 h2 bg-blue ba b--black-10"
          onClick={searchMostRecentSku}
        >
          Buscar Receita Mais Recente
        </button>
      </form>

      {idNotSent && (
        <div className="red w-50 mt7 center tc b">
          Não é possível buscar uma receita sem informar o ID
        </div>
      )}
      {notFound && (
        <div className="red w-50 mt7 center tc b">
          Produto não encontrado para o ID informado
        </div>
      )}

      <table className="center mt6 w-75">
        <thead className="f4 lh-copy">
          <tr>
            <th className="pr7">ID</th>
            <th className="pr7">TITULO</th>
            <th className="pr7">DATA</th>
            <th className="pr7">CONTEUDO</th>
            <th className="pr7">SKU</th>
          </tr>
        </thead>
        {product.id_sku && (
          <tbody>
            <tr className="tc">
              <td className="pr7">{product.id_sku}</td>
              <td className="pr7">{product.titulo}</td>
              <td className="pr7">{product.data}</td>
              <td className="pr7">{product.conteudo}</td>
              <td className="pr7">{product.produtos}</td>
            </tr>
          </tbody>
        )}
        {productContextValue && (
          <Fragment>
            <tbody>
              <tr className="tc">
                <td className="pr7">
                  {productContextValue?.product?.productId}
                </td>
                <td className="pr7">
                  {productContextValue?.product?.productName}
                </td>
                <td className="pr7">
                  {productContextValue?.product?.description}
                </td>
                <td className="pr7">
                  {productContextValue?.product?.description}
                </td>
                <td className="pr7">
                  {productContextValue?.selectedItem?.itemId}
                </td>
              </tr>
            </tbody>
          </Fragment>
        )}
      </table>
    </div>
  )
}

export default SearchSKUForm
