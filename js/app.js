$(document).ready(function() {
    // Lo primero que hacemos al abrir la página es cargar la lista de productos
    // para que la pantalla no se vea vacía.
    listarProductos();

    //   logica de navegacion 

    
    
    $('#btn-nav-inventario').click(function() {
        // Le quitamos el color de "activo" a todos los botones y se lo ponemos a este
        $('.nav-btn').removeClass('activo');
        $(this).addClass('activo');
        
        // Escondemos el formulario y mostramos la tabla 
        $('#seccion-registro').hide();
        $('#seccion-inventario').fadeIn(300);
        
        // Refrescamos la lista por si hubo algún cambio
        listarProductos(); 
    });


    $('#btn-nav-registro').click(function() {
        
        $('.nav-btn').removeClass('activo');
        $(this).addClass('activo');
        
    
        $('#seccion-inventario').hide();
        $('#seccion-registro').fadeIn(300);
    });

    

    //   validaciones 

    
    // Vigilamos el campo "Nombre" cada vez que se teclea algo
    $('#nombre').on('input', function() {
        // Si el usuario escribe un número o un símbolo raro, lo borramos inmediatamente.
        // Solo permitimos letras, espacios y letras con tildes o la eñe.
        this.value = this.value.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ\s]/g, '');
    });

    // V el campo "Precio"
    $('#precio').on('input', function() {
        // Si intentan poner un precio negativo (como -5), borramos la celda.
        if (this.value < 0) {
            this.value = ''; 
        }
    });


    
    //   guardar el producto 
    $('#form-registrar').submit(function(e) {
        // Evitamos que la página  se recargue al darle al botón de enviar
        e.preventDefault();
        
        // Recolectamos lo que el usuario escribió
        const nombre = $('#nombre').val().trim();
        const descripcion = $('#descripcion').val().trim();
        const precio = parseFloat($('#precio').val());

        // revision antes de enviar los datos al servidor 
        
        // Revisamos que el nombre realmente tenga solo letras
        const regexNombre = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/;
        if (!regexNombre.test(nombre)) {
            // Si hay algo raro, le lanzamos una alerta y detenemos todo.
            Swal.fire({
                title: 'Nombre Inválido',
                text: 'El nombre solo debe contener letras. Por favor revisa el campo.',
                icon: 'warning',
                background: '#1e1e1e', 
                color: '#ffffff',
                confirmButtonColor: '#ffc107' 
            });
            return; 
        }

        // Revisamos que el precio sea un número válido y mayor a cero
        if (isNaN(precio) || precio <= 0) {
            Swal.fire({
                title: 'Precio Inválido',
                text: 'El precio debe ser un número positivo mayor a cero.',
                icon: 'warning',
                background: '#1e1e1e',
                color: '#ffffff',
                confirmButtonColor: '#ffc107'
            });
            return; 
        }

        // Si todo esta bien despues de la revion enviamo los datos
        
        const $btn = $('#btn-registrar');
        const htmlOriginal = $btn.html(); 
        
     
        $btn.html('<i class="bi bi-arrow-repeat spinner"></i> Procesando...').prop('disabled', true);

        
        const data = {
            nombre: nombre,
            descripcion: descripcion,
            precio: precio
        };

        // le pasamos los datos a"registrar.php" 
        $.post('php/registrar.php', data, function(response) {
            
            if(response.status === 'success') {
                //  Mostramos la alerta 
                Swal.fire({
                    title: '¡Producto Agregado!',
                    text: 'El producto se registró correctamente.',
                    icon: 'success',
                    background: '#1e1e1e',
                    color: '#ffffff',
                    showConfirmButton: false, 
                    timer: 2000, // Se cierra sola en 2 segundos
                    timerProgressBar: true
                }).then(() => {
                    // Cuando la alerta se cierra, limpiamos el formulario
                    $('#form-registrar')[0].reset();
                    
                    $('#btn-nav-inventario').click();
                });
            } else {
                // Si el servidor (PHP) nos manda un error, lo mostramos
                Swal.fire({ title: 'Error', text: response.message, icon: 'error', background: '#1e1e1e', color: '#ffffff' });
            }
        }, 'json')
        
        // Si la conexión a internet falla o el archivo PHP no existe
        .fail(function() {
            mostrarToast("Error de conexión al registrar.", "error");
        })
        
    
        .always(function() {
            $btn.html(htmlOriginal).prop('disabled', false);
        });
    });


    // tabla inventario
    function listarProductos() {
        const $tabla = $('#tabla-productos');
        
        // Mientras esperamos al servidor, ponemos un mensaje de "Cargando"
        $tabla.html('<tr><td colspan="6" class="loading-row"><i class="bi bi-arrow-repeat spinner"></i> Cargando inventario...</td></tr>');

        // Le pedimos la información a "listar.php"
        $.post('php/listar.php', function(response) {
            let html = ''; 
            
            if (response.status === 'success') {
                
                // Si la base de datos está vacía, avisamos
                if (response.data.length === 0) {
                    html = '<tr><td colspan="6" class="loading-row"><i class="bi bi-inbox"></i> No hay productos registrados en el inventario.</td></tr>';
                } else {
                    
                    // Si hay datos, recorremos cada producto uno por uno
                    response.data.forEach(function(producto) {
                        
                        
                        const esDisponible = producto.estado === 'disponible';
                        const badgeClass = esDisponible ? 'badge-disponible' : 'badge-nodisponible';
                        const textoEstado = esDisponible ? 'Disponible' : 'No Disponible';

                        html += `
                            <tr class="fade-in">
                                <td>${producto.nombre}</td>
                                <td style="color:#aaa; font-size:0.9em;">${producto.descripcion}</td>
                                <td style="font-weight: bold;">$${producto.precio}</td>
                                
                                <td>
                                    <span class="badge ${badgeClass}">${textoEstado}</span>
                                </td>
                                
                                <td>
                                    <div class="edit-group">
                                        <input type="number" step="0.01" min="0.01" id="precio-${producto.id}" value="${producto.precio}" title="Modificar Precio">
                                        <select id="estado-${producto.id}" title="Modificar Estado">
                                            <option value="disponible" ${esDisponible ? 'selected' : ''}>Disponible</option>
                                            <option value="no disponible" ${!esDisponible ? 'selected' : ''}>No Disponible</option>
                                        </select>
                                    </div>
                                </td>
                                
                                <td>
                                    <button class="btn-update" id="btn-upd-${producto.id}" onclick="actualizarProducto(${producto.id})">
                                        <i class="bi bi-check2-circle no-margin"></i> Guardar
                                    </button>
                                </td>
                             </tr>`;
                    });
                }
                
                // Hacemos una pausa muy pequeñita (300ms) para que el efecto visual sea más agradable antes de pegar los datos
                setTimeout(() => { $tabla.html(html); }, 300); 
            }
        }, 'json').fail(function() {
            // Si el servidor falla al darnos la lista
            $tabla.html('<tr><td colspan="6" style="text-align:center; color:#f44336;"><i class="bi bi-exclamation-triangle"></i> Error de conexión al cargar el inventario.</td></tr>');
        });
    }


    // atualizar producto
    
    window.actualizarProducto = function(id) {
        
        // Agarramos los nuevos valores que están en la fila de ese producto específico
        const nuevoPrecio = $(`#precio-${id}`).val();
        const nuevoEstado = $(`#estado-${id}`).val();
        
        // Identificamos el botón que acabamos de presionar
        const $btn = $(`#btn-upd-${id}`);
        const htmlOriginal = $btn.html();

        // Le ponemos el icono de que está pensando para que el usuario no vuelva a dar clic
        $btn.html('<i class="bi bi-arrow-repeat spinner no-margin"></i>').prop('disabled', true);

        
        const data = {
            id: id,
            precio: nuevoPrecio,
            estado: nuevoEstado
        };

        // Se lo mandamos a "actualizar.php"
        $.post('php/actualizar.php', data, function(response) {
            
            // Mostramos la notificación flotante 
            mostrarToast(response.message, response.status);
            
            if(response.status === 'success') {
                // Si todo salió bien, pintamos la fila de verde suavecito por un segundo
                // para que el usuario sepa visualmente que ese fue el que se guardó.
                $btn.closest('tr').css('background-color', 'rgba(76, 175, 80, 0.2)');
                
                setTimeout(() => {
                    // Le quitamos el fondo verde y recargamos la tabla para que se actualicen las etiquetas de colores
                    $btn.closest('tr').css('background-color', '');
                    listarProductos();
                }, 800);
            } else {
                // Si falló, simplemente le devolvemos su texto original al botón
                $btn.html(htmlOriginal).prop('disabled', false);
            }
            
        }, 'json').fail(function() {
            mostrarToast("Error de conexión al actualizar.", "error");
            $btn.html(htmlOriginal).prop('disabled', false);
        });
    };


// configuraciones de las notificaciones 
    
    
    const Notificacion = Swal.mixin({
        toast: true,
        position: 'top-end', 
        showConfirmButton: false, 
        timer: 3000, //  3 segundos
        timerProgressBar: true, 
        background: '#ff000000', 
        color: '#ffffff',
        didOpen: (toast) => {
            // Un buen detalle: si el usuario pone el mouse encima, la barrita se pausa para que alcance a leer.
            toast.addEventListener('mouseenter', Swal.stopTimer)
            toast.addEventListener('mouseleave', Swal.resumeTimer)
        }
    });

    // Esta es la función que usamos en el resto del código para disparar la notificación fácilmente
    function mostrarToast(mensaje, tipo) {
        Notificacion.fire({
            icon: tipo, 
            title: mensaje 
        });
    }
});