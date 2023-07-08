import { renderHook } from '@testing-library/react-hooks'
import { useRouter } from 'next/navigation'
import { signIn } from 'next-auth/react'
import useAuth, { AuthResponse } from '@lib/hook/user-auth'

jest.mock('next-auth/react')
jest.mock('next/navigation')

describe('useAuth', () => {
  const mockRouterReplace = jest.fn()
  const accessToken = 'fakeAccessToken'
  const mockResponse: AuthResponse = {
    error: '',
    status: 200,
    ok: true,
    url: null,
    state: 'COMPLETE',
  }

  beforeEach(() => {
    ;(useRouter as jest.Mock).mockReturnValue({
      replace: mockRouterReplace,
    })
    ;(signIn as jest.Mock).mockResolvedValue(mockResponse)
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('should return initial response when access token is not provided', () => {
    const { result } = renderHook(() => useAuth({}))

    expect(result.current).toEqual({
      error: '',
      status: -1,
      ok: false,
      url: null,
      state: 'IDLE',
    })
  })

  it('should call signIn when access token is provided', async () => {
    const { result, waitForNextUpdate } = renderHook(() =>
      useAuth({ accessToken }),
    )

    expect(result.current.state).toEqual('LOADING')
    await waitForNextUpdate()
    expect(result.current).toEqual({ ...mockResponse, state: 'COMPLETE' })
    expect(mockRouterReplace).toHaveBeenCalledWith(`/room`)
  })

  it('should not redirect when there is an error', async () => {
    ;(signIn as jest.Mock).mockResolvedValue({
      ...mockResponse,
      error: 'Error',
      ok: false,
    })

    const { result, waitForNextUpdate } = renderHook(() =>
      useAuth({ accessToken }),
    )

    expect(result.current.state).toEqual('LOADING')
    await waitForNextUpdate()
    expect(result.current).toEqual({
      ...mockResponse,
      error: 'Error',
      ok: false,
      state: 'COMPLETE',
    })
    expect(mockRouterReplace).not.toHaveBeenCalled()
  })

  it('should redirect to /room when there is no error', async () => {
    ;(signIn as jest.Mock).mockResolvedValue({
      ...mockResponse,
      error: null,
    })

    const { result, waitForNextUpdate } = renderHook(() =>
      useAuth({ accessToken }),
    )

    expect(result.current.state).toEqual('LOADING')
    await waitForNextUpdate()
    expect(result.current).toEqual({
      ...mockResponse,
      error: null,
      ok: true,
      state: 'COMPLETE',
    })
    expect(mockRouterReplace).toHaveBeenCalledWith('/room')
  })
})
