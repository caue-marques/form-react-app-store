import React, { useState } from "react"

const SearchSKUForm: StorefrontFunctionComponent = () => {

    const [result, setResult] = useState({
        'id': ''
    })
    const [id, setId] = useState('')
    const [erro, setErro] = useState(false)

    const handleId = (e: any) => {
        setId(e.target.value)
    }

    const searchSku = async (e: any) => {

        if(!id) {
            setErro(true)
        }

        e.preventDefault()
        await fetch(`/api/dataentities/Receitas/documents/${id}`,
            {
                method: 'get'
            })
            .then(data => data.json())
            .then(sku => {
                setResult(sku)
                console.log(sku)
                setId('')
            })
            .catch(err => console.log(err))

            setInterval(() => {
                setErro(false)
            }, 6000)
    }

    const searchMostRecentSku = (e: any) => {
        e.preventDefault()

        console.log('oi')
    }

    return (
        <div>
            <form className="flex justify-center items-center mt6">
                <input className="w-25 h2 ba b--black-80" type="text" name="id_sku" id="id_sku" placeholder="ID DO SKU" onChange={handleId} />
                <button className="ml5 h2 bg-green ba b--black-10" onClick={searchSku}>Buscar Receita</button>
                <button className="ml5 h2 bg-blue ba b--black-10" onClick={searchMostRecentSku}>Buscar Receita Mais Recente</button>
            </form>

            {erro && <div className="red w-50 mt7 mb7 center tc b">Não é possível buscar uma receita sem informar o ID</div>}

            <table className="center mt6">
                <thead className="f2 lh-copy">
                    <tr>
                        <th className="pr7">TITULO</th>
                        <th className="pr7">DATA</th>
                        <th className="pr7">CONTEUDO</th>
                        <th className="pr7">SKU</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>{result.id || ''}</td>
                    </tr>
                </tbody>
            </table>
        </div>
    )
};

export default SearchSKUForm;
