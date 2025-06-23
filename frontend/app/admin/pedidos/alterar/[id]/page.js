'use client'
import FormPedido from "../../../../../app/components/forms/formPedido";
import Loading from "../../../../../app/components/loading";
import { useState, useEffect } from "react";

export default function AlterarPedido({ params: { id } }) {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(false);
  }, [id]);

  return (
    <div>
      {loading ? <Loading /> : <FormPedido pedidoId={id} />}
    </div>
  );
}