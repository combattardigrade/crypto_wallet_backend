const data = {
    main:
    {
        tab_wallet_btn: '財布',
        tab_rankings_btn: 'ランキング',
        tab_send_btn: '送る',
        tab_inbox_btn: '受信トレイ'
    },
    wallet:
    {
        wallet_title: '財布',
        wallet_send_btn: '送る',
        wallet_receive_btn: '受け取る',
        wallet_withdraw_btn: '引き出す',
        wallet_txs_all_btn: 'すべて',
        wallet_txs_received_btn: '受け取りました',
        wallet_txs_sent_btn: '送信しました'
    },
    rankings: { category: 'カテゴリー', year: '年', month: '月', week: '週間' },
    send:
    {
        send_to: 'に送る',
        amount: '量',
        reason: '理由',
        description: '説明文',
        verify_transfer: '転送を確認',
        input_send: '連絡先を選択',
        input_amount: '送金額を入力してください',
        input_reason: '理由を選択してください',
        input_description: '説明を入力してください'
    },
    inbox:
    {
        transactions_pending_approval: '承認待ちのトランザクション',
        no_payments: '支払いリクエストは見つかりませんでした'
    },
    menu:
    {
        contacts: '連絡先',
        deposit: '預り金',
        withdraw: '引き出す',
        settings: '設定',
        logout: 'ログアウト'
    },
    contacts:
    {
        contacts_title: '連絡先',
        all_contacts: 'すべての連絡先',
        no_contacts: '連絡先が見つかりません'
    },
    new_contact:
    {
        new_contact_title: '新しい連絡先を追加',
        search: '探す',
        input_search: 'ユーザー名またはメールでユーザーを検索',
        search_results: 'の検索結果',
        no_results: '検索結果は見つかりませんでした',
        add_contact_btn: '連絡先を追加',
        cancel_btn: 'キャンセル'
    },
    contact_details:
    {
        contact_details_title: '連絡先の詳細',
        user_id: 'ユーザーID',
        username: 'ユーザー名',
        full_name: 'フルネーム',
        email: 'Eメール',
        delete_contact_btn: '連絡先を削除',
        loading: '読み込んでいます...'
    },
    deposit:
        { deposit_title: 'JWSを入金', ethereum_address: 'あなたのイーサリアムアドレス' },
    withdraw:
    {
        withdraw_title: '引き出す',
        eth_address: 'ETHアドレス',
        amount: '量',
        input_address: '外部Ethereumアドレス',
        input_amount: '送金額を入力してください',
        withdraw_btn: '引き出す',
        cancel_btn: 'キャンセル'
    },
    settings:
    {
        settings_title: '設定',
        name: '名前',
        username: 'ユーザー名',
        email: 'Eメール'
    },
    tx_details:
    {
        tx_details_title: '取引詳細',
        tx_id: '取引ID',
        from: 'から',
        to: 'に',
        reason: '理由',
        amount: '量',
        date: '日付'
    },
    payment_request:
    {
        payment_request_title: '支払い請求の詳細',
        request_id: 'リクエストID',
        from: 'から',
        amount: '量',
        reason: '理由',
        description: '説明文',
        date: '日付',
        confirm_btn: '支払いを確認',
        reject_btn: '支払いを拒否'
    },
    confirm_tx:
    {
        confirm_tx_title: '支払いを確認',
        amount_to_transfer: '振込金額',
        transfer_to: '転送先',
        reason: '理由',
        description: '説明文',
        send_btn: '送る',
        cancel_btn: 'キャンセル'
    },
    tx_status:
    {
        tx_completed: '取引完了',
        tx: 'トランザクション',
        successfully: '成功した',
        rejected: '拒否されました',
        your_transfer: 'JWSの転送',
        completed_successfully: '正常に完了しました',
        has_been_rejected: '拒否されました',
        return_btn: '戻る'
    },
    intro: { login_btn: 'ログインする', signup_btn: 'サインアップ' },
    login:
    {
        login_title: 'ログインする',
        email: 'Eメール',
        password: 'パスワード',
        login_btn: 'ログインする',
        forgot_password: 'パスワードをお忘れですか？',
        create_account: '新しいアカウントを作成する'
    },
    signup:
    {
        signup_title: 'サインアップ',
        first_name: 'ファーストネーム',
        last_name: '苗字',
        username: 'ユーザー名',
        email: 'Eメール',
        password: 'パスワード',
        rpassword: 'パスワードを再度入力してください',
        signup_btn: '言う',
        login_btn: 'すでにアカウントをお持ちですか？ログインする'
    },
    error:
    {
        missing_required: 'すべての必須フィールドに入力してください',
        general: 'エラーが発生しました。もう一度やり直してください',
        enter_valid_email: '有効なメールアドレスを入力してください',
        passwords_dont_match: 'パスワードが一致しません',
        select_contact: '追加する連絡先を選択してください',
        not_enough_balance: 'バランスが足りません',
        enter_valid_amount: '有効な金額を入力してください'
    }
}

export default data