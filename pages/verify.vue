<script>
export default {
  async asyncData({ $axios, query, redirect }) {
    if (!query.id || !query.token) {
      return redirect({
        name: 'index',
        query: {
          status: 'missing_verification_parameter',
        },
      });
    }

    const { id, token } = query;

    try {
      await $axios.get(`/client/verify?id=${id}&token=${token}`);
      redirect({
        name: 'index',
        query: {
          status: 'verify_successfully',
        },
      });
    } catch (err) {
      let message = '验证失败';
      if (err.response && err.response.data && err.response.data.message) {
        message = err.response.data.message;
      }
      redirect({
        name: 'index',
        query: {
          error_message: message,
          status: 'verification_failed',
        },
      });
    }
  },
};
</script>
