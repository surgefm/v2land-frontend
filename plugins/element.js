import Vue from 'vue'
import Button from 'element-ui/lib/button'
import DatePicker from 'element-ui/lib/date-picker'
import TimeSelect from 'element-ui/lib/time-select'
import TimePicker from 'element-ui/lib/time-picker'
import Tooltip from 'element-ui/lib/tooltip'
import Input from 'element-ui/lib/input'
import Select from 'element-ui/lib/select'
import Option from 'element-ui/lib/option'
import Form from 'element-ui/lib/form'
import FormItem from 'element-ui/lib/form-item'
import Icon from 'element-ui/lib/icon'
import Step from 'element-ui/lib/step'
import Steps from 'element-ui/lib/steps'
import Message from 'element-ui/lib/message'
import Upload from 'element-ui/lib/upload'
import Checkbox from 'element-ui/lib/checkbox'
import CheckboxGroup from 'element-ui/lib/checkbox-group'

Vue.use(Button)
Vue.use(DatePicker)
Vue.use(TimeSelect)
Vue.use(TimePicker)
Vue.use(Tooltip)
Vue.use(Input)
Vue.use(Select)
Vue.use(Option)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Icon)
Vue.use(Step)
Vue.use(Steps)
Vue.use(Upload)
Vue.use(Checkbox)
Vue.use(CheckboxGroup)

Vue.prototype.$message = Message
