const errorHandler = (err, req, res, next) => {
  console.error(`[ERROR] ${req.method} ${req.path}:`, err.message)

  if (err.code === 'P2002') {
    return res.status(409).json({ error: 'Registro duplicado', field: err.meta?.target })
  }
  if (err.code === 'P2025') {
    return res.status(404).json({ error: 'Registro não encontrado' })
  }
  if (err.name === 'ZodError') {
    return res.status(400).json({ error: 'Dados inválidos', details: err.errors })
  }

  const status = err.status || err.statusCode || 500
  res.status(status).json({ error: err.message || 'Erro interno do servidor' })
}

module.exports = { errorHandler }
