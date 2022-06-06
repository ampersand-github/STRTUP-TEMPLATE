import { NextPage } from 'next';
import React from 'react';
import { Grid, Stack } from '@mui/material';
import { useRouter } from 'next/router';
import {
  ISignInFormContext,
  SignInForm,
} from 'src/component/organism/sign-in-form';
import { SubmitHandler } from 'react-hook-form';
import { SignInIcon } from 'src/component/atom/sign-in-icon';
import { CustomSnackbar } from 'src/component/atom/custom-snack-bar';
import { useAuthContext } from 'src/service/auth/auth-context';
import { CenterLoading } from 'src/component/atom/center-loading';
import { CustomLinkButton } from 'src/component/atom/custom-link-button';
import { ISignInResult, signIn } from 'src/service/auth/sign-in';
import { firebaseAuth } from 'src/service/firebase-config';

const SignInPage: NextPage = () => {
  const [open, setOpen] = React.useState<boolean>(false);
  const [message, setMessage] = React.useState<string>('');
  const router = useRouter();
  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  // 既にログインしていたらこのページを表示しない
  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  const { currentUser } = useAuthContext();
  if (currentUser === undefined) return <CenterLoading />;

  if (currentUser) {
    router.push({
      pathname: '/',
    });
    return <CenterLoading />;
  }
  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  // ボタン押下時処理
  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  const onSubmit: SubmitHandler<ISignInFormContext> = async (
    data: ISignInFormContext,
  ) => {
    const signInResult: ISignInResult = await signIn({
      auth: firebaseAuth,
      email: data.email,
      password: data.password,
    });
    if (signInResult.result === 'ok') {
      await router.push({
        pathname: '/',
      });
    } else {
      setMessage(signInResult.message);
      setOpen(true);
    }
  };

  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  // 画面
  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  return (
    <Stack spacing={2}>
      <CustomSnackbar
        open={open}
        setOpen={setOpen}
        message={message}
        alertType={'error'}
      />
      <SignInIcon />
      <SignInForm onSubmit={onSubmit} />
      <Grid marginTop={2} container>
        <Grid item xs>
          <CustomLinkButton
            text={'パスワードを忘れた場合'}
            link={'#'}
            variant={'caption'}
          />
        </Grid>
        <Grid item>
          <CustomLinkButton
            text={'新規登録する'}
            link={'/auth/sign-up'}
            variant={'caption'}
          />
        </Grid>
      </Grid>
    </Stack>
  );
};
export default SignInPage;
