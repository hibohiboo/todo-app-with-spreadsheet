'use strict'

/**
 * ID順にToDoをソート
 */
function sortTodoById(todos) {
  return todos.sort((a, b) => (a.id > b.id ? 1 : -1))
}

for (const dataStorageName of ['google']) {
  const {
    fetchAll,
    fetchByCompleted,
    create,
    update,
    remove,
  } = require(`../../dist/${dataStorageName}`).default
  const { removeRange } = require(`../../dist/${dataStorageName}`)

  // 普段はスキップ
  // 実際にスプレッドシートにアクセスするので時間がかかるため。
  // テスト時はjest --testTimeout=10000 のオプションが必要。
  describe.skip(dataStorageName, () => {
    // 毎回のテスト実行前に全てのToDoを削除
    beforeEach(async () => {
      await removeRange(1, 6)
    })

    describe('create(), fetchAll()', () => {
      test('create()で作成したToDoをfetechAll()で取得できる', async () => {
        expect(await fetchAll()).toEqual([])

        const todo1 = { id: 'a', title: 'ネーム', completed: false }
        const expcted1 = { ...todo1, rowNumber: 1 }
        await create(todo1)

        expect(await fetchAll()).toEqual([expcted1])

        const todo2 = { id: 'b', title: '下書き', completed: false }
        const expcted2 = { ...todo2, rowNumber: 2 }
        await create(todo2)

        const todo3 = { id: 'c', title: 'ペン入れ', completed: false }
        const expcted3 = { ...todo3, rowNumber: 3 }
        await create(todo3)

        expect(sortTodoById(await fetchAll())).toEqual([
          expcted1,
          expcted2,
          expcted3,
        ])
      })
    })

    describe('fetchByCompleted()', () => {
      test('completedの値が指定したものと等しいToDoだけを取得できる', async () => {
        // 初期状態確認
        expect(await fetchByCompleted(true)).toEqual([])
        expect(await fetchByCompleted(false)).toEqual([])

        // ToDoを3件追加
        const todo1 = { id: 'a', title: 'ネーム', completed: false }
        const expcted1 = { ...todo1, rowNumber: 1 }
        await create(todo1)
        const todo2 = { id: 'b', title: '下書き', completed: true }
        const expcted2 = { ...todo2, rowNumber: 2 }
        await create(todo2)
        const todo3 = { id: 'c', title: 'ペン入れ', completed: false }
        const expcted3 = { ...todo3, rowNumber: 3 }
        await create(todo3)

        // fetchByCompletedの結果を確認
        expect(await fetchByCompleted(true)).toEqual([expcted2])
        expect(sortTodoById(await fetchByCompleted(false))).toEqual([
          expcted1,
          expcted3,
        ])
      })
    })

    describe('remove()', () => {
      const todo1 = { id: 'a', title: 'ネーム', completed: false }
      const todo2 = { id: 'b', title: '下書き', completed: false }
      const expcted1 = { ...todo1, rowNumber: 1 }
      const expcted2 = { ...todo1, rowNumber: 2 }
      beforeEach(async () => {
        await create(todo1)
        await create(todo2)
      })
      test('指定したIDのToDoを削除する', async () => {
        expect(await remove(2)).toBe(2)
        expect(await fetchAll()).toEqual([expcted1])
      })
    })
    describe('update()', () => {
      const todo1 = { id: 'a', title: 'ネーム', completed: false }
      const todo2 = { id: 'b', title: '下書き', completed: false }
      const expcted1 = { ...todo1, rowNumber: 1 }
      const expcted2 = { ...todo2, rowNumber: 2 }
      beforeEach(async () => {
        await create(todo1)
        await create(todo2)
      })
      test('指定したIDのToDoを更新し、更新後のToDoを返す', async () => {
        // completedを更新
        expect(await update(1, { completed: true })).toEqual({
          rowNumber: 1,
          id: 'a',
          title: 'ネーム',
          completed: true,
        })
        expect(await fetchByCompleted(true)).toEqual([
          { rowNumber: 1, id: 'a', title: 'ネーム', completed: true },
        ])
        expect(await fetchByCompleted(false)).toEqual([expcted2])

        // タイトルを更新
        expect(await update(2, { title: 'ペン入れ' })).toEqual({
          rowNumber: 2,
          id: 'b',
          title: 'ペン入れ',
          completed: false,
        })
        expect(await fetchByCompleted(true)).toEqual([
          { rowNumber: 1, id: 'a', title: 'ネーム', completed: true },
        ])
        expect(await fetchByCompleted(false)).toEqual([
          { rowNumber: 2, id: 'b', title: 'ペン入れ', completed: false },
        ])
      })
    })
  })
}
