import { useRef } from "react";
import { EditIcon, Trash2Icon } from "lucide-react";
import { Link } from "react-router-dom";
import { useProductStore } from "../store/useProductStore";

function ProductCard({ product }) {
  const { deleteProduct } = useProductStore();
  const deleteDialogRef = useRef(null);

  return (
    <div className="card bg-base-100 shadow-xl hover:shadow-2xl transition-shadow duration-300">
      {/* PRODUCT IMAGE */}
      <figure className="relative pt-[56.25%]">
        <img
          src={product.image}
          alt={product.name}
          className="absolute top-0 left-0 w-full h-full object-cover"
        />
      </figure>

      <div className="card-body">
        {/* PRODUCT INFO */}
        <h2 className="card-title text-lg font-semibold">{product.name}</h2>
        <p className="text-2xl font-bold text-primary">${Number(product.price).toFixed(2)}</p>

        {/* CARD ACTIONS */}
        <div className="card-actions justify-end mt-4">
          <Link to={`/product/${product.id}`} className="btn btn-sm btn-info btn-outline">
            <EditIcon className="size-4" />
          </Link>

          <button
            className="btn btn-sm btn-error  btn-outline onClick"
            onClick={() => deleteDialogRef.current?.showModal()}
          >
            <Trash2Icon className="size-4" />
          </button>
        </div>
      </div>

      <dialog
        ref={deleteDialogRef}
        className="modal"
        aria-labelledby={`delete-product-title-${product.id}`}
      >
        <div className="modal-box">
          <h3 id={`delete-product-title-${product.id}`} className="text-lg font-bold">
            ¿Eliminar producto?
          </h3>
          <p className="py-4">
            ¿Estás seguro de que deseas eliminar <strong>{product.name}</strong>? Esta acción no se
            puede deshacer.
          </p>
          <div className="modal-action">
            <form method="dialog">
              <button className="btn btn-ghost">Cancelar</button>
            </form>
            <button
              className="btn btn-error"
              onClick={() => {
                deleteDialogRef.current?.close();
                deleteProduct(product.id);
              }}
            >
              Eliminar
            </button>
          </div>
        </div>
        <form method="dialog" className="modal-backdrop">
          <button aria-label="Cerrar diálogo">Cerrar</button>
        </form>
      </dialog>
    </div>
  );
}
export default ProductCard;