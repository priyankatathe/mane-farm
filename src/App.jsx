import React, { useState } from 'react'
import { BrowserRouter } from 'react-router-dom'
import AppRoutes from './admin/routes/AppRoutes'

const App = () => {

  return <>
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>

  </>
}

export default App