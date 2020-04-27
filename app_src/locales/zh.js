const data = {
    main:
    {
        tab_wallet_btn: '钱包',
        tab_rankings_btn: '排名',
        tab_send_btn: '发送',
        tab_inbox_btn: '收件箱'
    },
    wallet:
    {
        wallet_title: '钱包',
        wallet_send_btn: '发送',
        wallet_receive_btn: '接收',
        wallet_withdraw_btn: '退出',
        wallet_txs_all_btn: '所有',
        wallet_txs_received_btn: '已收到',
        wallet_txs_sent_btn: '已发送'
    },
    rankings: { category: '类别', year: '年', month: '月', week: '周' },
    send:
    {
        send_to: '发送至',
        amount: '量',
        reason: '原因',
        description: '描述',
        verify_transfer: '验证转移',
        input_send: '选择一个联系人',
        input_amount: '输入转账金额',
        input_reason: '选择一个原因',
        input_description: '输入描述'
    },
    inbox:
    {
        transactions_pending_approval: '待批准的交易',
        no_payments: '找不到付款请求'
    },
    menu:
    {
        contacts: '联络人',
        deposit: '存款',
        withdraw: '退出',
        settings: '设定值',
        logout: '登出'
    },
    contacts:
    {
        contacts_title: '联络人',
        all_contacts: '所有联系人',
        no_contacts: '找不到联络人'
    },
    new_contact:
    {
        new_contact_title: '新增联络人',
        search: '搜索',
        input_search: '通过用户名或电子邮件搜索用户',
        search_results: '搜索结果',
        no_results: '找不到搜索结果',
        add_contact_btn: '添加联系人',
        cancel_btn: '取消'
    },
    contact_details:
    {
        contact_details_title: '联系方式',
        user_id: '用户身份',
        username: '用户名',
        full_name: '全名',
        email: '电子邮件',
        delete_contact_btn: '删除联络人',
        loading: '载入中...'
    },
    deposit: { deposit_title: '存款JWS', ethereum_address: '您的以太坊地址' },
    withdraw:
    {
        withdraw_title: '退出',
        eth_address: 'ETH地址',
        amount: '量',
        input_address: '外部以太坊地址',
        input_amount: '输入转账金额',
        withdraw_btn: '退出',
        cancel_btn: '取消'
    },
    settings:
    {
        settings_title: '设定值',
        name: '名称',
        username: '用户名',
        email: '电子邮件'
    },
    tx_details:
    {
        tx_details_title: '交易明细',
        tx_id: '交易编号',
        from: '从',
        to: '至',
        reason: '原因',
        amount: '量',
        date: '日期'
    },
    payment_request:
    {
        payment_request_title: '付款要求明细',
        request_id: '要求编号',
        from: '从',
        amount: '量',
        reason: '原因',
        description: '描述',
        date: '日期',
        confirm_btn: '确认付款',
        reject_btn: '拒绝付款'
    },
    confirm_tx:
    {
        confirm_tx_title: '确认付款',
        amount_to_transfer: '转账金额',
        transfer_to: '转移至',
        reason: '原因',
        description: '描述',
        send_btn: '发送',
        cancel_btn: '取消'
    },
    tx_status:
    {
        tx_completed: '交易完成',
        tx: '交易',
        successfully: '成功地',
        rejected: '被拒绝',
        your_transfer: '您对JWS的转让',
        completed_successfully: '成功完成',
        has_been_rejected: '已被拒绝',
        return_btn: '返回'
    },
    intro: { login_btn: '登录', signup_btn: '注册' },
    login:
    {
        login_title: '登录',
        email: '电子邮件',
        password: '密码',
        login_btn: '登录',
        forgot_password: '忘记密码了吗？',
        create_account: '创建一个新账户'
    },
    signup:
    {
        signup_title: '注册',
        first_name: '名字',
        last_name: '姓',
        username: '用户名',
        email: '电子邮件',
        password: '密码',
        rpassword: '重复输入密码',
        signup_btn: '说出来',
        login_btn: '已经有帐号了？登录'
    },
    error:
    {
        missing_required: '输入所有必填字段',
        general: '发生错误，请重试',
        enter_valid_email: '输入有效的电子邮件',
        passwords_dont_match: '密码不匹配',
        select_contact: '选择要添加的联系人',
        not_enough_balance: '您的余额不足',
        enter_valid_amount: '输入有效金额'
    }
}

export default data