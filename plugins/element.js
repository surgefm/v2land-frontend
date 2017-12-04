import Vue from 'vue'
import Button from 'element-ui/lib/button'
import Tooltip from 'element-ui/lib/tooltip'
import Input from 'element-ui/lib/input'
import Select from 'element-ui/lib/select'
import Option from 'element-ui/lib/option'
import Form from 'element-ui/lib/form'
import FormItem from 'element-ui/lib/form-item'
import Icon from 'element-ui/lib/icon'
import Message from 'element-ui/lib/message'
import Popover from 'element-ui/lib/popover'

Vue.use(Button)
Vue.use(Tooltip)
Vue.use(Input)
Vue.use(Select)
Vue.use(Option)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Icon)
Vue.use(Popover)

Vue.prototype.$message = Message
