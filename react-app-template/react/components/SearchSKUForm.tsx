import React, { useEffect, useState } from "react"

const SearchSKUForm: StorefrontFunctionComponent = () => {

    const product = {
        'id_sku': '',
        'titulo': '',
        'data': '',
        'conteudo': '',
        'produtos': 0
    }

    const [result, setResult] = useState(product)
    const [id, setId] = useState('')
    const [erro, setErro] = useState(false)
    const [notFound, setNotFound] = useState(false)

    const resetResult = () => {
        setResult(product)
        console.log(result)
    }

    function validateIdHasBeenSent(): boolean {
        if (!id) {
            setNotFound(false)
            setErro(true)

            setInterval(() => {
                setErro(false)
            }, 6000)

            return false
        }

        return true
    }

    function resultHasBeenSet(): boolean {
        if (!result.id_sku) {
            setNotFound(true)
            setErro(false)

            setInterval(() => {
                setNotFound(false)
            }, 6000)

            return false;
        }

        return true
    }

    const searchSku = async (e: any) => {
        e.preventDefault()

        resetResult()

        validateIdHasBeenSent()
        if (!validateIdHasBeenSent()) return

        await fetch(`/api/dataentities/Receitas/search/?_fields=id_sku,titulo,data,conteudo,produtos`)
            .then(data => {
                return data.json()
            })
            .then(skus => {
                for (let sku of skus) {
                    if (sku.produtos == id) {
                        setNotFound(false)
                        setErro(false)
                        setResult(sku)
                        return
                    }
                }
                resultHasBeenSet()
            })
    }

    const searchMostRecentSku = async (e: any) => {
        e.preventDefault()

        resetResult()

        await fetch(`/api/dataentities/Receitas/search/?_fields=id_sku,titulo,data,conteudo,produtos`)
            .then(data => {
                return data.json()
            })
            .then(skus => {
                let mostRecentReceipe = skus[0]
                let dateMostRecente = new Date(mostRecentReceipe.data)

                for (let sku of skus) {
                    let currentDate = new Date(sku.data)

                    if (currentDate > dateMostRecente) {
                        dateMostRecente = currentDate
                        setResult(sku)
                    }
                }
            })
    }

    useEffect(()=>{
       
    },[resetResult] )

    return (
        <div>
            <form className="flex justify-center items-center mt6">
                <input className="w-25 h2 ba b--black-80" type="text" value={id} name="id_sku" id="id_sku" placeholder="ID DO SKU" onChange={(e) => setId(e.target.value)} />
                <button type="submit" className="pointer ml5 h2 bg-green ba b--black-10" onClick={searchSku}>Buscar Receita</button>
                <button type="submit" className="pointer ml5 h2 bg-blue ba b--black-10" onClick={searchMostRecentSku}>Buscar Receita Mais Recente</button>
            </form>

            {erro && <div className="red w-50 mt7 center tc b">Não é possível buscar uma receita sem informar o ID</div>}
            {notFound && <div className="red w-50 mt7 center tc b">ID não encontrado</div>}


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
                <tbody>
                    <tr className="tc">
                        <td className="pr7">{result.id_sku || ''}</td>
                        <td className="pr7">{result.titulo || ''}</td>
                        <td className="pr7">{result.data || ''}</td>
                        <td className="pr7">{result.conteudo || ''}</td>
                        <td className="pr7">{result.produtos || ''}</td>
                    </tr>
                </tbody>
            </table>
        </div>
    )
};

export default SearchSKUForm;
